from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 👉 kết nối MySQL (XAMPP)
DATABASE_URL = "mysql+pymysql://root:@localhost/ai_chitieu"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()