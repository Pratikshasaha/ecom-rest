# Fix Nodemailer Error: nodemailer.createTransporter is not a function

## Steps:
- [x] Step 1: Edit index.js - Fix both createTransporter → createTransport calls and standardize SMTP config to use env vars.
- [x] Step 2: Test server restart and verify fix (node index.js, test POST /users).\n- [x] Step 3: Mark complete.\n\n**TODO complete. Nodemailer error fixed.**
