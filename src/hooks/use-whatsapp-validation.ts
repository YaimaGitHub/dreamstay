"use client"

import { useState, useEffect, useCallback } from "react"

interface WhatsAppValidationResult {
  isValid: boolean
  isValidating: boolean
  error: string | null
  formattedNumber: string
  country: string | null
}

// Lista completa de códigos de país con sus longitudes típicas
const COUNTRY_CODES = {
  // América del Norte
  "+1": { name: "Estados Unidos/Canadá", minLength: 10, maxLength: 10 },

  // Caribe y América Central
  "+1242": { name: "Bahamas", minLength: 7, maxLength: 7 },
  "+1246": { name: "Barbados", minLength: 7, maxLength: 7 },
  "+1264": { name: "Anguila", minLength: 7, maxLength: 7 },
  "+1268": { name: "Antigua y Barbuda", minLength: 7, maxLength: 7 },
  "+1284": { name: "Islas Vírgenes Británicas", minLength: 7, maxLength: 7 },
  "+1340": { name: "Islas Vírgenes de EE.UU.", minLength: 7, maxLength: 7 },
  "+1345": { name: "Islas Caimán", minLength: 7, maxLength: 7 },
  "+1441": { name: "Bermudas", minLength: 7, maxLength: 7 },
  "+1473": { name: "Granada", minLength: 7, maxLength: 7 },
  "+1649": { name: "Islas Turcas y Caicos", minLength: 7, maxLength: 7 },
  "+1664": { name: "Montserrat", minLength: 7, maxLength: 7 },
  "+1670": { name: "Islas Marianas del Norte", minLength: 7, maxLength: 7 },
  "+1671": { name: "Guam", minLength: 7, maxLength: 7 },
  "+1684": { name: "Samoa Americana", minLength: 7, maxLength: 7 },
  "+1721": { name: "Sint Maarten", minLength: 7, maxLength: 7 },
  "+1758": { name: "Santa Lucía", minLength: 7, maxLength: 7 },
  "+1767": { name: "Dominica", minLength: 7, maxLength: 7 },
  "+1784": { name: "San Vicente y las Granadinas", minLength: 7, maxLength: 7 },
  "+1787": { name: "Puerto Rico", minLength: 7, maxLength: 7 },
  "+1809": { name: "República Dominicana", minLength: 10, maxLength: 10 },
  "+1829": { name: "República Dominicana", minLength: 10, maxLength: 10 },
  "+1849": { name: "República Dominicana", minLength: 10, maxLength: 10 },
  "+1868": { name: "Trinidad y Tobago", minLength: 7, maxLength: 7 },
  "+1869": { name: "San Cristóbal y Nieves", minLength: 7, maxLength: 7 },
  "+1876": { name: "Jamaica", minLength: 7, maxLength: 7 },
  "+1939": { name: "Puerto Rico", minLength: 7, maxLength: 7 },

  // América del Sur
  "+54": { name: "Argentina", minLength: 10, maxLength: 11 },
  "+55": { name: "Brasil", minLength: 10, maxLength: 11 },
  "+56": { name: "Chile", minLength: 8, maxLength: 9 },
  "+57": { name: "Colombia", minLength: 10, maxLength: 10 },
  "+58": { name: "Venezuela", minLength: 10, maxLength: 10 },
  "+591": { name: "Bolivia", minLength: 8, maxLength: 8 },
  "+592": { name: "Guyana", minLength: 7, maxLength: 7 },
  "+593": { name: "Ecuador", minLength: 9, maxLength: 9 },
  "+594": { name: "Guayana Francesa", minLength: 9, maxLength: 9 },
  "+595": { name: "Paraguay", minLength: 9, maxLength: 9 },
  "+596": { name: "Martinica", minLength: 9, maxLength: 9 },
  "+597": { name: "Surinam", minLength: 7, maxLength: 7 },
  "+598": { name: "Uruguay", minLength: 8, maxLength: 8 },

  // México y América Central
  "+52": { name: "México", minLength: 10, maxLength: 10 },
  "+501": { name: "Belice", minLength: 7, maxLength: 7 },
  "+502": { name: "Guatemala", minLength: 8, maxLength: 8 },
  "+503": { name: "El Salvador", minLength: 8, maxLength: 8 },
  "+504": { name: "Honduras", minLength: 8, maxLength: 8 },
  "+505": { name: "Nicaragua", minLength: 8, maxLength: 8 },
  "+506": { name: "Costa Rica", minLength: 8, maxLength: 8 },
  "+507": { name: "Panamá", minLength: 8, maxLength: 8 },
  "+508": { name: "San Pedro y Miquelón", minLength: 6, maxLength: 6 },
  "+509": { name: "Haití", minLength: 8, maxLength: 8 },

  // CUBA - MUY IMPORTANTE
  "+53": { name: "Cuba", minLength: 8, maxLength: 8 },

  // Europa Occidental
  "+33": { name: "Francia", minLength: 9, maxLength: 9 },
  "+34": { name: "España", minLength: 9, maxLength: 9 },
  "+39": { name: "Italia", minLength: 10, maxLength: 10 },
  "+41": { name: "Suiza", minLength: 9, maxLength: 9 },
  "+43": { name: "Austria", minLength: 10, maxLength: 11 },
  "+44": { name: "Reino Unido", minLength: 10, maxLength: 10 },
  "+45": { name: "Dinamarca", minLength: 8, maxLength: 8 },
  "+46": { name: "Suecia", minLength: 9, maxLength: 9 },
  "+47": { name: "Noruega", minLength: 8, maxLength: 8 },
  "+48": { name: "Polonia", minLength: 9, maxLength: 9 },
  "+49": { name: "Alemania", minLength: 10, maxLength: 11 },

  // Europa del Este
  "+7": { name: "Rusia/Kazajistán", minLength: 10, maxLength: 10 },
  "+380": { name: "Ucrania", minLength: 9, maxLength: 9 },
  "+375": { name: "Bielorrusia", minLength: 9, maxLength: 9 },
  "+374": { name: "Armenia", minLength: 8, maxLength: 8 },
  "+994": { name: "Azerbaiyán", minLength: 9, maxLength: 9 },
  "+995": { name: "Georgia", minLength: 9, maxLength: 9 },
  "+996": { name: "Kirguistán", minLength: 9, maxLength: 9 },
  "+992": { name: "Tayikistán", minLength: 9, maxLength: 9 },
  "+993": { name: "Turkmenistán", minLength: 8, maxLength: 8 },
  "+998": { name: "Uzbekistán", minLength: 9, maxLength: 9 },

  // Europa Central y Balcanes
  "+420": { name: "República Checa", minLength: 9, maxLength: 9 },
  "+421": { name: "Eslovaquia", minLength: 9, maxLength: 9 },
  "+385": { name: "Croacia", minLength: 8, maxLength: 9 },
  "+386": { name: "Eslovenia", minLength: 8, maxLength: 8 },
  "+387": { name: "Bosnia y Herzegovina", minLength: 8, maxLength: 8 },
  "+389": { name: "Macedonia del Norte", minLength: 8, maxLength: 8 },
  "+381": { name: "Serbia", minLength: 8, maxLength: 9 },
  "+382": { name: "Montenegro", minLength: 8, maxLength: 8 },
  "+383": { name: "Kosovo", minLength: 8, maxLength: 9 },
  "+355": { name: "Albania", minLength: 9, maxLength: 9 },
  "+359": { name: "Bulgaria", minLength: 8, maxLength: 9 },
  "+40": { name: "Rumania", minLength: 9, maxLength: 9 },
  "+36": { name: "Hungría", minLength: 9, maxLength: 9 },

  // Otros países europeos
  "+351": { name: "Portugal", minLength: 9, maxLength: 9 },
  "+352": { name: "Luxemburgo", minLength: 9, maxLength: 9 },
  "+353": { name: "Irlanda", minLength: 9, maxLength: 9 },
  "+354": { name: "Islandia", minLength: 7, maxLength: 7 },
  "+356": { name: "Malta", minLength: 8, maxLength: 8 },
  "+357": { name: "Chipre", minLength: 8, maxLength: 8 },
  "+358": { name: "Finlandia", minLength: 9, maxLength: 10 },
  "+370": { name: "Lituania", minLength: 8, maxLength: 8 },
  "+371": { name: "Letonia", minLength: 8, maxLength: 8 },
  "+372": { name: "Estonia", minLength: 7, maxLength: 8 },
  "+373": { name: "Moldavia", minLength: 8, maxLength: 8 },
  "+376": { name: "Andorra", minLength: 6, maxLength: 6 },
  "+377": { name: "Mónaco", minLength: 8, maxLength: 9 },
  "+378": { name: "San Marino", minLength: 10, maxLength: 10 },
  "+423": { name: "Liechtenstein", minLength: 7, maxLength: 7 },

  // Asia Oriental
  "+86": { name: "China", minLength: 11, maxLength: 11 },
  "+81": { name: "Japón", minLength: 10, maxLength: 11 },
  "+82": { name: "Corea del Sur", minLength: 10, maxLength: 11 },
  "+850": { name: "Corea del Norte", minLength: 8, maxLength: 12 },
  "+852": { name: "Hong Kong", minLength: 8, maxLength: 8 },
  "+853": { name: "Macao", minLength: 8, maxLength: 8 },
  "+886": { name: "Taiwán", minLength: 9, maxLength: 9 },
  "+976": { name: "Mongolia", minLength: 8, maxLength: 8 },

  // Sudeste Asiático
  "+60": { name: "Malasia", minLength: 9, maxLength: 10 },
  "+62": { name: "Indonesia", minLength: 9, maxLength: 12 },
  "+63": { name: "Filipinas", minLength: 10, maxLength: 10 },
  "+65": { name: "Singapur", minLength: 8, maxLength: 8 },
  "+66": { name: "Tailandia", minLength: 9, maxLength: 9 },
  "+84": { name: "Vietnam", minLength: 9, maxLength: 10 },
  "+855": { name: "Camboya", minLength: 8, maxLength: 9 },
  "+856": { name: "Laos", minLength: 8, maxLength: 10 },
  "+95": { name: "Myanmar", minLength: 8, maxLength: 10 },
  "+673": { name: "Brunéi", minLength: 7, maxLength: 7 },
  "+670": { name: "Timor Oriental", minLength: 8, maxLength: 8 },

  // Asia Meridional
  "+91": { name: "India", minLength: 10, maxLength: 10 },
  "+92": { name: "Pakistán", minLength: 10, maxLength: 10 },
  "+93": { name: "Afganistán", minLength: 9, maxLength: 9 },
  "+94": { name: "Sri Lanka", minLength: 9, maxLength: 9 },
  "+880": { name: "Bangladesh", minLength: 10, maxLength: 10 },
  "+975": { name: "Bután", minLength: 8, maxLength: 8 },
  "+977": { name: "Nepal", minLength: 10, maxLength: 10 },
  "+960": { name: "Maldivas", minLength: 7, maxLength: 7 },

  // Oriente Medio
  "+90": { name: "Turquía", minLength: 10, maxLength: 10 },
  "+98": { name: "Irán", minLength: 10, maxLength: 10 },
  "+964": { name: "Irak", minLength: 10, maxLength: 10 },
  "+961": { name: "Líbano", minLength: 7, maxLength: 8 },
  "+962": { name: "Jordania", minLength: 9, maxLength: 9 },
  "+963": { name: "Siria", minLength: 9, maxLength: 9 },
  "+965": { name: "Kuwait", minLength: 8, maxLength: 8 },
  "+966": { name: "Arabia Saudí", minLength: 9, maxLength: 9 },
  "+967": { name: "Yemen", minLength: 9, maxLength: 9 },
  "+968": { name: "Omán", minLength: 8, maxLength: 8 },
  "+970": { name: "Palestina", minLength: 9, maxLength: 9 },
  "+971": { name: "Emiratos Árabes Unidos", minLength: 9, maxLength: 9 },
  "+972": { name: "Israel", minLength: 9, maxLength: 9 },
  "+973": { name: "Baréin", minLength: 8, maxLength: 8 },
  "+974": { name: "Catar", minLength: 8, maxLength: 8 },

  // África del Norte
  "+20": { name: "Egipto", minLength: 10, maxLength: 10 },
  "+212": { name: "Marruecos", minLength: 9, maxLength: 9 },
  "+213": { name: "Argelia", minLength: 9, maxLength: 9 },
  "+216": { name: "Túnez", minLength: 8, maxLength: 8 },
  "+218": { name: "Libia", minLength: 9, maxLength: 9 },
  "+249": { name: "Sudán", minLength: 9, maxLength: 9 },
  "+211": { name: "Sudán del Sur", minLength: 9, maxLength: 9 },

  // África Occidental
  "+220": { name: "Gambia", minLength: 7, maxLength: 7 },
  "+221": { name: "Senegal", minLength: 9, maxLength: 9 },
  "+222": { name: "Mauritania", minLength: 8, maxLength: 8 },
  "+223": { name: "Malí", minLength: 8, maxLength: 8 },
  "+224": { name: "Guinea", minLength: 9, maxLength: 9 },
  "+225": { name: "Costa de Marfil", minLength: 8, maxLength: 10 },
  "+226": { name: "Burkina Faso", minLength: 8, maxLength: 8 },
  "+227": { name: "Níger", minLength: 8, maxLength: 8 },
  "+228": { name: "Togo", minLength: 8, maxLength: 8 },
  "+229": { name: "Benín", minLength: 8, maxLength: 8 },
  "+230": { name: "Mauricio", minLength: 7, maxLength: 8 },
  "+231": { name: "Liberia", minLength: 7, maxLength: 8 },
  "+232": { name: "Sierra Leona", minLength: 8, maxLength: 8 },
  "+233": { name: "Ghana", minLength: 9, maxLength: 9 },
  "+234": { name: "Nigeria", minLength: 10, maxLength: 10 },
  "+235": { name: "Chad", minLength: 8, maxLength: 8 },
  "+236": { name: "República Centroafricana", minLength: 8, maxLength: 8 },
  "+237": { name: "Camerún", minLength: 9, maxLength: 9 },
  "+238": { name: "Cabo Verde", minLength: 7, maxLength: 7 },
  "+239": { name: "Santo Tomé y Príncipe", minLength: 7, maxLength: 7 },
  "+240": { name: "Guinea Ecuatorial", minLength: 9, maxLength: 9 },
  "+241": { name: "Gabón", minLength: 7, maxLength: 8 },
  "+242": { name: "República del Congo", minLength: 9, maxLength: 9 },
  "+243": { name: "República Democrática del Congo", minLength: 9, maxLength: 9 },
  "+244": { name: "Angola", minLength: 9, maxLength: 9 },
  "+245": { name: "Guinea-Bisáu", minLength: 7, maxLength: 7 },

  // África Oriental
  "+251": { name: "Etiopía", minLength: 9, maxLength: 9 },
  "+252": { name: "Somalia", minLength: 8, maxLength: 9 },
  "+253": { name: "Yibuti", minLength: 8, maxLength: 8 },
  "+254": { name: "Kenia", minLength: 9, maxLength: 9 },
  "+255": { name: "Tanzania", minLength: 9, maxLength: 9 },
  "+256": { name: "Uganda", minLength: 9, maxLength: 9 },
  "+257": { name: "Burundi", minLength: 8, maxLength: 8 },
  "+258": { name: "Mozambique", minLength: 9, maxLength: 9 },
  "+260": { name: "Zambia", minLength: 9, maxLength: 9 },
  "+261": { name: "Madagascar", minLength: 9, maxLength: 10 },
  "+262": { name: "Reunión", minLength: 9, maxLength: 9 },
  "+263": { name: "Zimbabue", minLength: 9, maxLength: 9 },
  "+264": { name: "Namibia", minLength: 9, maxLength: 9 },
  "+265": { name: "Malaui", minLength: 9, maxLength: 9 },
  "+266": { name: "Lesoto", minLength: 8, maxLength: 8 },
  "+267": { name: "Botsuana", minLength: 8, maxLength: 8 },
  "+268": { name: "Esuatini", minLength: 8, maxLength: 8 },
  "+269": { name: "Comoras", minLength: 7, maxLength: 7 },
  "+27": { name: "Sudáfrica", minLength: 9, maxLength: 9 },
  "+290": { name: "Santa Elena", minLength: 4, maxLength: 4 },
  "+291": { name: "Eritrea", minLength: 7, maxLength: 7 },

  // Oceanía
  "+61": { name: "Australia", minLength: 9, maxLength: 9 },
  "+64": { name: "Nueva Zelanda", minLength: 8, maxLength: 9 },
  "+679": { name: "Fiyi", minLength: 7, maxLength: 7 },
  "+685": { name: "Samoa", minLength: 7, maxLength: 7 },
  "+686": { name: "Kiribati", minLength: 8, maxLength: 8 },
  "+687": { name: "Nueva Caledonia", minLength: 6, maxLength: 6 },
  "+688": { name: "Tuvalu", minLength: 7, maxLength: 7 },
  "+689": { name: "Polinesia Francesa", minLength: 8, maxLength: 8 },
  "+690": { name: "Tokelau", minLength: 4, maxLength: 4 },
  "+691": { name: "Micronesia", minLength: 7, maxLength: 7 },
  "+692": { name: "Islas Marshall", minLength: 7, maxLength: 7 },
  "+675": { name: "Papúa Nueva Guinea", minLength: 8, maxLength: 8 },
  "+676": { name: "Tonga", minLength: 5, maxLength: 7 },
  "+677": { name: "Islas Salomón", minLength: 7, maxLength: 7 },
  "+678": { name: "Vanuatu", minLength: 7, maxLength: 7 },
  "+680": { name: "Palaos", minLength: 7, maxLength: 7 },
  "+681": { name: "Wallis y Futuna", minLength: 6, maxLength: 6 },
  "+682": { name: "Islas Cook", minLength: 5, maxLength: 5 },
  "+683": { name: "Niue", minLength: 4, maxLength: 4 },
  "+684": { name: "Samoa Americana", minLength: 7, maxLength: 7 },
  "+674": { name: "Nauru", minLength: 7, maxLength: 7 },
  "+672": { name: "Isla Norfolk", minLength: 6, maxLength: 6 },

  // Territorios especiales
  "+297": { name: "Aruba", minLength: 7, maxLength: 7 },
  "+298": { name: "Islas Feroe", minLength: 6, maxLength: 6 },
  "+299": { name: "Groenlandia", minLength: 6, maxLength: 6 },
  "+350": { name: "Gibraltar", minLength: 8, maxLength: 8 },
  "+500": { name: "Islas Malvinas", minLength: 5, maxLength: 5 },
  "+590": { name: "Guadalupe", minLength: 9, maxLength: 9 },
  "+599": { name: "Curazao", minLength: 7, maxLength: 8 },
} as const

export const useWhatsAppValidation = (initialValue = "") => {
  const [value, setValue] = useState(initialValue)
  const [validationResult, setValidationResult] = useState<WhatsAppValidationResult>({
    isValid: false,
    isValidating: false,
    error: null,
    formattedNumber: initialValue,
    country: null,
  })

  // Función para limpiar el número (solo para validación, no para mostrar)
  const cleanNumber = (input: string): string => {
    // Permitir + al inicio y números
    return input.replace(/[^\d+]/g, "")
  }

  // Función para detectar el país basado en el código
  const detectCountry = (number: string): { code: string; info: any } | null => {
    if (!number.startsWith("+")) return null

    // Ordenar por longitud de código (más largos primero)
    const sortedCodes = Object.keys(COUNTRY_CODES).sort((a, b) => b.length - a.length)

    for (const code of sortedCodes) {
      if (number.startsWith(code)) {
        return { code, info: COUNTRY_CODES[code as keyof typeof COUNTRY_CODES] }
      }
    }
    return null
  }

  // Función principal de validación
  const validateNumber = useCallback((number: string): WhatsAppValidationResult => {
    const cleaned = cleanNumber(number)

    if (!cleaned || cleaned === "+") {
      return {
        isValid: false,
        isValidating: false,
        error: null, // No mostrar error si está vacío
        formattedNumber: number,
        country: null,
      }
    }

    if (!cleaned.startsWith("+")) {
      return {
        isValid: false,
        isValidating: false,
        error: "El número debe comenzar con + seguido del código de país",
        formattedNumber: number,
        country: null,
      }
    }

    if (cleaned.length < 4) {
      return {
        isValid: false,
        isValidating: false,
        error: null, // No mostrar error mientras está escribiendo
        formattedNumber: number,
        country: null,
      }
    }

    const countryMatch = detectCountry(cleaned)

    if (!countryMatch) {
      return {
        isValid: false,
        isValidating: false,
        error: "Código de país no reconocido",
        formattedNumber: number,
        country: null,
      }
    }

    const { code, info } = countryMatch
    const numberWithoutCode = cleaned.substring(code.length)

    if (numberWithoutCode.length === 0) {
      return {
        isValid: false,
        isValidating: false,
        error: null, // No mostrar error mientras está escribiendo
        formattedNumber: number,
        country: info.name,
      }
    }

    if (numberWithoutCode.length < info.minLength) {
      return {
        isValid: false,
        isValidating: false,
        error: `Número incompleto para ${info.name} (necesita ${info.minLength} dígitos)`,
        formattedNumber: number,
        country: info.name,
      }
    }

    if (numberWithoutCode.length > info.maxLength) {
      return {
        isValid: false,
        isValidating: false,
        error: `Número muy largo para ${info.name} (máx. ${info.maxLength} dígitos)`,
        formattedNumber: number,
        country: info.name,
      }
    }

    // Validar que solo contenga números después del código de país
    if (!/^\d+$/.test(numberWithoutCode)) {
      return {
        isValid: false,
        isValidating: false,
        error: "El número solo debe contener dígitos después del código de país",
        formattedNumber: number,
        country: info.name,
      }
    }

    return {
      isValid: true,
      isValidating: false,
      error: null,
      formattedNumber: number,
      country: info.name,
    }
  }, [])

  // Efecto para validar cuando cambia el valor
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const result = validateNumber(value)
      setValidationResult(result)
    }, 300) // Delay para evitar validación excesiva

    return () => clearTimeout(timeoutId)
  }, [value, validateNumber])

  // Función para manejar cambios (permite escribir libremente)
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue)
  }, [])

  return {
    value,
    setValue: handleChange,
    isValid: validationResult.isValid,
    isValidating: validationResult.isValidating,
    error: validationResult.error,
    formattedNumber: validationResult.formattedNumber,
    country: validationResult.country,
  }
}
