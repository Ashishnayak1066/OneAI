#!/bin/bash
python -m server.app &
cd client && npm run dev
