"""
File to setup and load an initial version of the DB
Author: Dhaval Shrishrimal

IMPORTANT: DO NOT CHANGE OR EDIT THIS FILE.
"""

# External Imports
from os import remove
from glob import glob
from faker import Faker
from asyncio import run
from random import randint
from sqlalchemy.ext.asyncio import AsyncSession

# Internal Imports
from users import User
from database import Base, engine

def check_existing_db():
    """Check if DB exists and delete it."""
    files = glob('../project.db*')
    for current_file in files:
        remove(current_file)

async def create_db_and_tables():
    """Create DB and Users Table"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def populate_db(n: int = 100):
    """Populate the database with fake users"""
    fake = Faker()
    async with AsyncSession(engine) as session:
        for _ in range(n):
            user = User(
                email=fake.unique.email(),
                hashed_password=fake.password(length=12),
                name=fake.name(),
                is_superuser=randint(0, 1) == 1,
                is_verified=randint(0, 1) == 1
            )
            session.add(user)
        await session.commit()

if __name__ == "__main__":
    N = 100 # How many users do you want to create?
    check_existing_db()
    run(create_db_and_tables())
    run(populate_db(N))
    print(f"Database setup and population complete with {N} users.")