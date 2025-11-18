# this is db connection files where we make connection with db
from sqlmodel import SQLModel,Session,create_engine

engine = create_engine("/sqlite:///database.db")


SQLModel.metadata.create_all(engine)
