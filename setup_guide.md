# Project Setup Guide  

Step-by-step instructions to set up the project environment, manage Node.js versions, and compile SCSS.  

---

## 1. Install NVM (Node Version Manager)  

If **NVM** is not installed on server, install it by running:  

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

After installation, reload your terminal or run:  

```bash
source ~/.bashrc
```

---

## 2. Verify NVM Installation  

Check if NVM is installed correctly:  

```bash
nvm --version
```

Expected output: a version number (e.g., `0.39.1`).  

---

## 3. Configure Node.js Version  

1. Navigate to the **project root directory** (where `package.json` is located).  
   
   ```bash
   cd /public_html/web/themes/custom/quitpath
   ```

2. Check if a **.nvmrc** file exists:  

   ```bash
   ls -a | grep .nvmrc
   ```

3. If not found, create one:  

   ```bash
   echo "22.16.0" > .nvmrc
   ```

4. Install the compatible Node.js version:  

   ```bash
   nvm install
   ```

5. Use the installed Node.js version:  

   ```bash
   nvm use
   ```

6. (Optional) Set default Node.js version for the project:  

   ```bash
   nvm alias default 22.16.0
   ```

---

## 4. Install Project Dependencies  

Make sure you are inside the **project root directory** and install dependencies:  

```bash
npm install
```


---

## 5. Compile SCSS

To compile SCSS:

From the project root directory, run:  

```bash
npm run build
```

🔹 Important:

- Steps 1–4 are only required once during the initial setup.
- For ongoing work, you’ll only need to follow Step 5.
- If you run into any Node.js version issues later, run:

```bash
nvm use
```

to switch to the compatible Node.js version defined in .nvmrc.

---

✅ **Setup Complete**  
You are now ready to run and develop the project.  
