export default {
  common: {
    backToHome: 'Back to home',
    continue: 'Continue',
    back: 'Back',
    generateFiles: 'Generate files',
    generating: 'Generating…',
    download: 'Download',
    remove: 'Remove',
    requiredFields: '* Required fields.',
    emptyValue: '—',
    certisatWeb: 'CertiSAT Web',
  },
  header: {
    subtitle: 'Electronic signature and digital seal request generation',
  },
  footer: {
    text: 'Unofficial web version of the Certifica application (formerly SOLCEDI). All processing happens in your browser.',
  },
  home: {
    title: 'Select the desired option',
    intro:
      'All cryptographic operations run locally in your browser; no data or files are sent to any server.',
    options: {
      signature: {
        title: 'Electronic signature generation request',
        description:
          'Generate the private key (.key) and request file (.req) to obtain your e.firma for the first time.',
      },
      renewal: {
        title: 'Electronic signature renewal request',
        description:
          'Renew your valid e.firma by generating a new private key and the renewal file (.ren).',
      },
      seal: {
        title: 'Digital Seal Certificate (CSD) request',
        description:
          'Generate keys and digital seal requests for your branches, signed with your e.firma.',
      },
      viewer: {
        title: 'View a certificate',
        description:
          'View the details and validity of a digital certificate (.cer) without leaving the browser.',
      },
    },
  },
  signature: {
    title: 'Electronic signature generation request',
    steps: {
      applicant: 'Applicant data',
      password: 'Private key password',
      download: 'File download',
    },
    provideData: 'Provide the following information:',
    legalRepresentative: 'Legal representative (optional)',
    legalRepresentativeHint:
      'Select this option for individuals with legally declared incapacity, minors, or deceased persons with an executor, and enter the representative’s RFC.',
    legalRepresentativeRfc: 'Legal representative RFC *',
    providePassword: 'Provide the password that will protect your private key:',
    keyGenerationHint:
      'The 2048-bit RSA key pair is generated in your browser and may take a few seconds.',
    success:
      'Your files were generated successfully. Download them and keep the private key (.key) and its password in a safe place: the SAT cannot recover them.',
    nextSteps: 'Submit the .req file at your SAT appointment to complete your e.firma process.',
  },
  renewal: {
    title: 'Electronic signature renewal request',
    steps: {
      credentials: 'Valid electronic signature',
      password: 'New password',
      download: 'File download',
    },
    intro:
      'To continue the renewal process, you must sign the request using your valid electronic signature.',
    providePassword: 'Provide the password for your new electronic signature:',
    success:
      'Your renewal files were generated successfully. Submit the .ren file through {certisat} to complete the renewal.',
  },
  seal: {
    title: 'Digital Seal Certificate (CSD) request',
    steps: {
      credentials: 'Valid electronic signature',
      branches: 'Branches or units',
      download: 'File download',
    },
    intro:
      'To continue generating the Digital Seal Certificate request, your valid electronic signature will be used.',
    branchesIntro:
      'Enter one branch or unit for each digital seal you wish to request. Each seal will have its own password-protected private key.',
    sealLabel: 'Seal {number}',
    branchName: 'Branch or unit name *',
    branchPlaceholder: 'Example: Headquarters',
    addBranch: 'Add another branch',
    success:
      'Your files were generated successfully. Submit the .sdg package through {certisat} and keep each private key (.key) with its password.',
  },
  certificate: {
    title: 'View a certificate',
    intro:
      'Select a digital certificate (.cer) to view its details. The file is processed locally in your browser.',
    fileLabel: 'Digital certificate (*.cer file)',
  },
  credential: {
    certificateLabel: 'Valid electronic signature certificate (*.cer file)',
    privateKeyLabel: 'Certificate private key (*.key file)',
    passwordLabel: 'Private key password',
    verify: 'Verify credentials',
    verified: 'Credentials verified',
    selectCertificate: 'Select your certificate (.cer).',
    selectPrivateKey: 'Select your private key (.key).',
    expired:
      'The certificate has expired. To renew it, visit a SAT office.',
    readError: 'The file could not be read.',
    mismatch: 'The private key does not match the selected certificate.',
    decryptError: 'The private key could not be decrypted.',
  },
  certificateSummary: {
    serialNumber: 'Serial number',
    subject: 'Subject',
    rfc: 'RFC',
    curp: 'CURP',
    issuer: 'Issued by',
    validity: 'Validity',
    expired: 'Expired',
    valid: 'Valid',
  },
  fields: {
    rfc: 'RFC *',
    curp: 'CURP *',
    email: 'Email *',
    password: 'Private key password *',
    passwordConfirmation: 'Password confirmation *',
  },
  passwordStrength: {
    label: 'Security level: {level}',
    levels: {
      'muy-debil': 'Very weak',
      debil: 'Weak',
      aceptable: 'Acceptable',
      fuerte: 'Strong',
      'muy-fuerte': 'Very strong',
    },
  },
  validation: {
    rfc: {
      required: 'RFC is required.',
      length: 'RFC must be 12 or 13 characters long.',
      format: 'RFC format is invalid.',
      date: 'The date embedded in the RFC is invalid.',
      legalRepresentative: 'The legal representative RFC is invalid.',
    },
    curp: {
      required: 'CURP is required.',
      format: 'CURP format is invalid.',
    },
    email: {
      required: 'Email is required.',
      format: 'Email format is invalid.',
    },
    password: {
      required: 'Password is required.',
      minLength: 'Password must be at least {min} characters long.',
      maxLength: 'Password must not exceed {max} characters.',
      mismatch: 'Passwords do not match.',
    },
    branch: {
      nameRequired: 'Branch or unit name is required.',
    },
  },
  errors: {
    generic: 'An error occurred while generating the files.',
    certificateRead: 'The certificate could not be read.',
    certificate: {
      invalid:
        'The selected file is not a Digital Certificate, is damaged, or is incorrectly encoded.',
    },
    privateKey: {
      invalid: 'The private key file (.key) is invalid or damaged.',
      wrongPassword: 'The private key password is incorrect.',
    },
  },
  files: {
    signature: {
      privateKey: 'Password-encrypted private key (keep it in a safe place).',
      request: 'Electronic signature generation request to submit to the SAT.',
    },
    renewal: {
      privateKey: 'New password-encrypted private key (keep it in a safe place).',
      renewal:
        'Renewal request signed with your valid e.firma, to submit through CertiSAT.',
    },
    seal: {
      privateKey: 'Digital seal private key for "{branch}".',
      request: 'Digital seal certificate request for "{branch}".',
      package: 'Request package signed with your e.firma, to submit through CertiSAT.',
    },
  },
}
