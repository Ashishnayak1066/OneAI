#!/bin/bash
python server/app.py &
cd client && npm run dev
