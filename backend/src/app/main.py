from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(
    title="My Awesome API",
    description="This is an example FastAPI app with OpenAPI schema",
    version="1.0.0",

)
@app.get('/',name="Test")
async  def Home():
    name = "Babar 🥰"
    return  f" Well Come {name}"
