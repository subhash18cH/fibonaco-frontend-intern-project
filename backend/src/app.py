"""
Backend for Frontend Intern Project
Author: Dhaval Shrishrimal

IMPORTANT: DO NOT CHANGE OR EDIT THIS FILE.
"""

# External Imports
from uvicorn import run
from typing import Optional
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, status, Query, Depends

from sqlalchemy import select, desc, or_
from sqlalchemy.ext.asyncio import AsyncSession

# Internal Imports
from database import get_async_session
from users import (
    User, UserResponseModel, SingleUserRow,
    PlainUserID, ChangeStatus
)

# Setup FastAPI
app = FastAPI(
    title='Fibonaco\'s Intern Project',
    description='Frontend Intern\'s Project designed to test NextJs know-how.',
    version='0.1.0',
    root_path='/api',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=["*"],
)

# Setup API Routes
@app.post('/verify')
async def verify_user(user: PlainUserID, database: AsyncSession = Depends(get_async_session)):
    """Verify a User by ID"""
    user: User = await database.get(User, user.id)
    if not user:
        return JSONResponse(
            content={'error': 'User not found'},
            status_code=status.HTTP_404_NOT_FOUND
        )
    user.is_verified = True
    await database.commit()
    return {'status': 'success', 'message': f'User {user.name} verified successfully!'}

@app.post('/delete')
async def delete_user(user: PlainUserID, database: AsyncSession = Depends(get_async_session)):
    """Delete a User by ID"""
    user: User = await database.get(User, user.id)
    if not user:
        return JSONResponse(
            content={'error': 'User not found'},
            status_code=status.HTTP_404_NOT_FOUND
        )
    await database.delete(user)
    await database.commit()
    return {'status': 'success', 'message': f'User {user.name} deleted successfully!'}

@app.post('/admin')
async def toggle_admin(change: ChangeStatus, database: AsyncSession = Depends(get_async_session)):
    """Change a User's Admin status"""
    user: User = await database.get(User, change.id)
    if not user:
        return JSONResponse(
            content={'error': 'User not found'},
            status_code=status.HTTP_404_NOT_FOUND
        )
    elif user.is_superuser == change.is_superuser:
        return JSONResponse(
            content={'error': 
                        f'User {user.name} is already an Super User' 
                        if change.is_superuser else 
                        f'User {user.name} is already a Regular User'
                    },
            status_code=status.HTTP_400_BAD_REQUEST
        )
    user.is_superuser = change.is_superuser
    await database.commit()
    return {'status': 'success', 'message': f'User {user.name}\'s status updated successfully!'}

@app.get('/users', status_code=status.HTTP_200_OK, response_model=UserResponseModel)
async def get_paginated_users(
    # Query Params
    page: int = Query(1, ge=1), # Defaults to page number 1
    limit: int = Query(10, ge=1), # Number of records to fetch 
    search: Optional[str] = None, # Search String for Name + Email
    are_superusers: Optional[str] = Query(None, pattern="^(superuser|normaluser)$"), # Should Fetch Admins?
    are_verified: Optional[str] = Query(None, pattern="^(verified|notverified)$"), # Should Fetch Verified Users?

    # Database Session
    database: AsyncSession = Depends(get_async_session)
):
    """Get Paginated Users"""
    # Build the Predicates List
    predicates = []
    if search:
        term = f'%{search.strip()}%'
        predicates.append(or_(
            User.name.ilike(term),
            User.email.ilike(term)
        ))
    if are_superusers:
        predicates.append(User.is_superuser.is_(are_superusers == 'superuser'))
    if are_verified:
        predicates.append(User.is_verified.is_(are_verified == 'verified'))

    # Fetch the Filtered Rows
    offset = (page - 1) * limit
    filtered_rows_obj = await database.execute(
        select(User)
        .where(*predicates)
        .order_by(desc(User.id))
        .offset(offset)
        .limit(limit + 1)
    )
    filtered_rows = filtered_rows_obj.scalars().all()

    # Return the Response
    has_next = len(filtered_rows) > limit
    return UserResponseModel(
        page=page,
        has_next=has_next,
        data=[
            SingleUserRow.model_validate(user)
            for user in filtered_rows[:limit]
        ]
    )

# Start the App
if __name__ == '__main__':
    run(app, workers=1, log_level='info')