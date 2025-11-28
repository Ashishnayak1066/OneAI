#!/bin/bash
cd server && python app.py &
cd client && npm run dev
