export default {
  common: {
    backToHome: 'Volver al inicio',
    continue: 'Continuar',
    back: 'Regresar',
    generateFiles: 'Generar archivos',
    generating: 'Generando…',
    download: 'Descargar',
    remove: 'Eliminar',
    requiredFields: '* Campos requeridos.',
    emptyValue: '—',
    certisatWeb: 'CertiSAT Web',
  },
  header: {
    subtitle: 'Generación de requerimientos de e.firma y sellos digitales',
  },
  footer: {
    text: 'Versión web no oficial de la aplicación Certifica (antes SOLCEDI). Todo el procesamiento ocurre en su navegador.',
  },
  home: {
    title: 'Seleccione la opción deseada',
    intro:
      'Todos los cálculos criptográficos se realizan localmente en su navegador; ningún dato ni archivo se envía a servidor alguno.',
    options: {
      signature: {
        title: 'Requerimiento de generación de firma electrónica',
        description:
          'Genere la llave privada (.key) y el requerimiento (.req) para tramitar su e.firma por primera vez.',
      },
      renewal: {
        title: 'Requerimiento de renovación de firma electrónica',
        description:
          'Renueve su e.firma vigente generando una nueva llave privada y el archivo de renovación (.ren).',
      },
      seal: {
        title: 'Solicitud de Certificados de Sello Digital (CSD)',
        description:
          'Genere llaves y solicitudes de sellos digitales para sus sucursales, firmadas con su e.firma.',
      },
      viewer: {
        title: 'Consultar un certificado',
        description:
          'Visualice los datos y la vigencia de un certificado digital (.cer) sin salir del navegador.',
      },
    },
  },
  signature: {
    title: 'Requerimiento de generación de firma electrónica',
    steps: {
      applicant: 'Datos del solicitante',
      password: 'Contraseña de la llave privada',
      download: 'Descarga de archivos',
    },
    provideData: 'Proporcione los siguientes datos:',
    legalRepresentative: 'Representante legal (opcional)',
    legalRepresentativeHint:
      'Seleccione esta opción para personas físicas con incapacidad legalmente declarada, menores de edad o personas fallecidas con albacea, y capture el RFC del representante.',
    legalRepresentativeRfc: 'RFC del representante legal *',
    providePassword: 'Proporcione la contraseña que protegerá su llave privada:',
    keyGenerationHint:
      'La generación del par de llaves RSA de 2048 bits se realiza en su navegador y puede tardar unos segundos.',
    success:
      'Sus archivos se generaron correctamente. Descárguelos y guarde la llave privada (.key) y su contraseña en un lugar seguro: el SAT no puede recuperarlos.',
    nextSteps: 'Presente el archivo .req en su cita del SAT para concluir el trámite de su e.firma.',
  },
  renewal: {
    title: 'Requerimiento de renovación de firma electrónica',
    steps: {
      credentials: 'Firma electrónica vigente',
      password: 'Nueva contraseña',
      download: 'Descarga de archivos',
    },
    intro:
      'Para continuar con el proceso de renovación es necesario firmar la solicitud usando su firma electrónica vigente.',
    providePassword: 'Proporcione la contraseña para su nueva firma electrónica:',
    success:
      'Sus archivos de renovación se generaron correctamente. Envíe el archivo .ren mediante {certisat} para concluir la renovación.',
  },
  seal: {
    title: 'Solicitud de Certificados de Sello Digital (CSD)',
    steps: {
      credentials: 'Firma electrónica vigente',
      branches: 'Sucursales o unidades',
      download: 'Descarga de archivos',
    },
    intro:
      'Para continuar con el proceso de generación de la solicitud de Certificados de Sello Digital, se utilizará su firma electrónica vigente.',
    branchesIntro:
      'Capture una sucursal o unidad por cada sello digital que desee solicitar. Cada sello tendrá su propia llave privada protegida con contraseña.',
    sealLabel: 'Sello {number}',
    branchName: 'Nombre de la sucursal o unidad *',
    branchPlaceholder: 'Ejemplo: Matriz',
    addBranch: 'Agregar otra sucursal',
    success:
      'Sus archivos se generaron correctamente. Envíe el paquete .sdg mediante {certisat} y conserve cada llave privada (.key) con su contraseña.',
  },
  certificate: {
    title: 'Consultar un certificado',
    intro:
      'Seleccione un certificado digital (.cer) para visualizar sus datos. El archivo se procesa localmente en su navegador.',
    fileLabel: 'Certificado digital (archivo *.cer)',
  },
  credential: {
    certificateLabel: 'Certificado de firma electrónica vigente (archivo *.cer)',
    privateKeyLabel: 'Llave privada del certificado (archivo *.key)',
    passwordLabel: 'Contraseña de la llave privada',
    verify: 'Verificar credenciales',
    verified: 'Credenciales verificadas',
    selectCertificate: 'Seleccione su certificado (.cer).',
    selectPrivateKey: 'Seleccione su llave privada (.key).',
    expired:
      'El certificado está caduco. Para renovarlo acuda a una oficina del SAT.',
    readError: 'No se pudo leer el archivo.',
    mismatch: 'La llave privada no corresponde al certificado seleccionado.',
    decryptError: 'No se pudo descifrar la llave privada.',
  },
  certificateSummary: {
    serialNumber: 'Número de serie',
    subject: 'Titular',
    rfc: 'RFC',
    curp: 'CURP',
    issuer: 'Emitido por',
    validity: 'Vigencia',
    expired: 'Caduco',
    valid: 'Vigente',
  },
  fields: {
    rfc: 'RFC *',
    curp: 'CURP *',
    email: 'Correo electrónico *',
    password: 'Contraseña de la clave privada *',
    passwordConfirmation: 'Confirmación de la contraseña *',
  },
  passwordStrength: {
    label: 'Nivel de seguridad: {level}',
    levels: {
      'muy-debil': 'Muy débil',
      debil: 'Débil',
      aceptable: 'Aceptable',
      fuerte: 'Fuerte',
      'muy-fuerte': 'Muy fuerte',
    },
  },
  validation: {
    rfc: {
      required: 'El RFC es requerido.',
      length: 'El RFC debe tener 12 o 13 caracteres.',
      format: 'El RFC no tiene un formato válido.',
      date: 'La fecha contenida en el RFC no es válida.',
      legalRepresentative: 'El RFC del representante legal no es válido.',
    },
    curp: {
      required: 'La CURP es requerida.',
      format: 'La CURP no tiene un formato válido.',
    },
    email: {
      required: 'El correo electrónico es requerido.',
      format: 'El correo electrónico no tiene un formato válido.',
    },
    password: {
      required: 'La contraseña es requerida.',
      minLength: 'La contraseña debe tener al menos {min} caracteres.',
      maxLength: 'La contraseña no debe exceder {max} caracteres.',
      mismatch: 'Las contraseñas no coinciden.',
    },
    branch: {
      nameRequired: 'El nombre de la sucursal o unidad es requerido.',
    },
  },
  errors: {
    generic: 'Ocurrió un error al generar los archivos.',
    certificateRead: 'No se pudo leer el certificado.',
    certificate: {
      invalid:
        'El archivo elegido no es un Certificado Digital, está dañado o mal codificado.',
    },
    privateKey: {
      invalid: 'El archivo de llave privada (.key) no es válido o está dañado.',
      wrongPassword: 'La contraseña de la llave privada es incorrecta.',
    },
  },
  files: {
    signature: {
      privateKey:
        'Llave privada cifrada con su contraseña (guárdela en un lugar seguro).',
      request: 'Requerimiento de generación de firma electrónica para presentar al SAT.',
    },
    renewal: {
      privateKey:
        'Nueva llave privada cifrada con su contraseña (guárdela en un lugar seguro).',
      renewal:
        'Requerimiento de renovación firmado con su e.firma vigente, para enviar mediante CertiSAT.',
    },
    seal: {
      privateKey: 'Llave privada del sello digital de "{branch}".',
      request: 'Solicitud de certificado de sello digital de "{branch}".',
      package:
        'Paquete de solicitudes firmado con su e.firma, para enviar mediante CertiSAT.',
    },
  },
}
