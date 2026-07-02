# Certifica Web

Unofficial web version of the SAT desktop application **Certifica** (formerly SOLCEDI). It lets you generate e.firma requests, renewals, and digital seal certificates directly in the browser—no Java install and no dependency on a specific operating system.

## Project origin

This repository was built through **reverse engineering** of the official `Certifica.jar` (decompiled Java code with obfuscated classes such as `mx.sat.gob.a.c`, `SolcediV2`, etc.). The following were analyzed:

- UI flows (e.firma generation, renewal, CSD, certificate inspection).
- Validation rules (RFC, CURP, email, password).
- Output cryptographic formats (`.key`, `.req`, `.ren`, `.sdg`) based on PKCS#8, PKCS#10, and PKCS#7.
- Subject attributes in requests (RFC in `x500UniqueIdentifier`, CURP in `serialNumber`, etc.).

That analysis was reimplemented in TypeScript to run **entirely in the browser**. It is not a direct bytecode port: bad practices from the original code (single-letter names, UI/logic coupling) were cleaned up, and the app was split into services, components, and views with descriptive names.

> **Privacy:** all processing happens on your device. No keys, passwords, or files are sent to any server.

## Technologies

| Area | Stack |
|------|--------|
| **Frontend** | [Vue 3](https://vuejs.org/) (Composition API), [Vue Router 5](https://router.vuejs.org/), [Pinia 3](https://pinia.vuejs.org/) |
| **Language** | [TypeScript 6](https://www.typescriptlang.org/) |
| **Build** | [Vite 8](https://vite.dev/) |
| **Cryptography** | [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) (RSA 2048 key generation) + [node-forge](https://github.com/digitalbazaar/forge) (PKCS#8, PKCS#10, PKCS#7, X.509; SHA-1 signatures to match the Java app) |
| **Internationalization** | [vue-i18n 11](https://vue-i18n.intlify.dev/) (Spanish / English) |
| **Testing** | [Vitest 4](https://vitest.dev/), [Vue Test Utils](https://test-utils.vuejs.org/), [Playwright](https://playwright.dev/) |
| **Code quality** | ESLint, Oxlint, Oxfmt |

## Requirements

- **Node.js** `^22.18.0` or `>=24.12.0` (see `engines` in `package.json`)
- **npm** 10 or later

## How to run the app

### 1. Clone and install dependencies

```sh
git clone https://github.com/quezadasergio/certifica-web.git
cd certifica-web
npm install
```

### 2. Development mode

Start the local dev server with hot reload:

```sh
npm run dev
```

Open the URL shown in the terminal (default: `http://localhost:5173`).

### 3. Production build

Build the optimized app for deployment (includes type checking):

```sh
npm run build
```

Output is written to the `dist/` folder.

### 4. Preview the build

Serve the compiled version locally:

```sh
npm run preview
```

### 5. Tests and lint (optional)

```sh
npm run test:unit   # unit tests (Vitest)
npm run test:e2e    # end-to-end tests (Playwright)
npm run lint        # oxlint + eslint
npm run format      # format src/ with oxfmt
```

## Features

- **Electronic signature generation request (e.firma):** generates an encrypted private key (`.key`, PKCS#8) and request file (`.req`, PKCS#10) to obtain your e.firma for the first time.
- **e.firma renewal request:** with a valid certificate (`.cer`) and private key, generates a new key and renewal file (`.ren`, PKCS#7 signed) to submit via [CertiSAT Web](https://certisat.sat.gob.mx).
- **Digital Seal Certificate (CSD) request:** generates keys and requests per branch, plus a package (`.sdg`) signed with your e.firma.
- **Certificate viewer:** displays subject, RFC, CURP, serial number, and validity of a `.cer` file.

The UI is available in **Spanish** and **English** (ES / EN toggle in the header).

## Project structure

```
certifica-web/
├── src/
│   ├── components/       # Reusable UI (wizard, password meter, etc.)
│   ├── views/            # One view per workflow
│   ├── router/           # Routes
│   ├── i18n/             # es / en translations
│   ├── services/
│   │   ├── crypto/       # RSA keys, PKCS#8/#10/#7, certificate parsing
│   │   ├── certifica/    # Workflow orchestration
│   │   └── validation/   # RFC, CURP, email, password
│   └── types/
├── public/
├── e2e/                  # Playwright tests
├── index.html
├── package.json
└── vite.config.ts
```

## Legal notice

This project is **not affiliated** with the SAT or the official Certifica software. Generated files follow standard formats (PKCS#8, PKCS#10, PKCS#7), but verify acceptance in official procedures before production use. Reverse engineering third-party software may be subject to legal restrictions depending on your jurisdiction and the SAT's terms.

## License

See [LICENSE](LICENSE).

## Live demo

Try the app online: [https://certifica-web.netlify.app/](https://certifica-web.netlify.app/)
