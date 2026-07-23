from fastapi import FastAPI

app = FastAPI(
    title="TrialReady LK API",
    version="0.1.0"
)


@app.get("/")
def root():
    return {"message": "TrialReady LK API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}