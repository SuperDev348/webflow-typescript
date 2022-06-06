import { capitalize } from "lodash"

const ABBR_EXCEPTIONS = [
  "Light's",
  'Mallampati',
  'Alvarado',
  'Baermann',
  'Berlin',
  "Castleman's",
  'Centor',
  'Child-Pugh',
  'p-ANCA',
  'c-ANCA',
  'Horadi-Mori',
  'Mini-Cog',
  'Lachman',
  'Anti-GBM',
  "Murphy's",
  "Kernig's",
  "Brudzinski's",
  "Lemierre's",
  "Lhermitte's",
  "Kawasaki's",
  "Behçet's",
  "Parkinson's",
  "Stevens-Johnson's",
  'Marsh',
  'Nikolsky',
  'Neisseria',
  'Chlamydia',
  "Prehn's",
  "Schirmer's",
  'Howell-Jolly',
  'Hurley',
  'Ehler-Danlos',
  'ST-segment',
  'Epstein-Barr',
  'Kruis',
  'Rome',
  'Maudsley',
  'Saccharomyces',
  'Manning',
  'Cheyne-Stokes',
  'ST-segment',
  'Salmonella',
  'Shigella',
  'Campylobacter',
  'Shiga',
  "Lev's",
  "Bartholin's",
  "Munchausen's",
  "Lenègre's",
  "Weber's",
  "Burkitt's",
  "Fried's",
  "Adie's",
  "Crouzon's",
  "Buerger's",
  "Becker's",
  "Morton's",
  "Fanconi's",
  "Friedreich's",
  "Hashimoto's",
  "Whipple's",
  "Barrett's",
  "Parkinson's",
  "Turner's",
  "Ewing's",
  "Sjögren's",
  "Grave's",
  "Scheuermann's",
  "Blount's",
  "Pott's",
  "Wardenburg's",
  "Hodgkin's",
  "Parkinson's",
  "Crohn's",
  "Wernicke's",
  "Kennedy's",
  "Conn's",
  "Asherman's",
  "Bartter's",
  "Friedreich's",
  "Paget's",
  "Eagle's",
  "Rieger's",
  "Dieulafoy's",
  "Reinke's",
  "Eisenmenger's",
  "Rieger's",
  "Ludwig's",
  "Dressler's",
  'Ruptured',
  "Purtscher's",
  "Lemierre's",
  "Fanconi's",
  "Jeune's",
  "Liddle's",
  "Hartnup's",
  "Leber's",
  "Darier's",
  "Norrie's",
  "Angelman's",
  "Gitelman's",
  "Gaucher's",
  "Sydenham's",
  "Noonan's",
  "Heyde's",
  "Skene's",
  "Fowler's",
  "McArdle's",
  "Todd's",
  "Dejerine's",
  "Felty's",
  "Whipple's",
  "Vincent's",
  "Wallenberg's",
  "Lyme's",
  "Crohn's",
  "Pick's",
  "Adie's",
  "Asherman's",
  "Raynaud's",
  "Ebstein's",
  "Fabry's",
  "Marfan's",
  "Bowen's",
  "Waldenstrom's",
  "Grave's",
  "Hashimoto's",
  "Meckel's",
  "Huntington's",
  "Sjögren's",
  "Behçet's",
  "Buerger's",
  "Castleman's",
  "Cogan's",
  "Ewing's",
  "Waldenström's",
  "Raynaud's",
  "Parkinson's",
  "Turner's",
  "Lyme's",
  "Wilson's",
  "Addison's",
  "Hodgkin's",
  "Parkinson's",
  "Paget's",
  "Still's",
  "Cushing's",
  "Vincent's",
  "Hirschsprung's",
  "Crohn's",
  "Hirschsprung's",
  "Ménière's",
  "Tourette's",
  "Reiter's",
  "Reye's",
  "Riedel's",
  "Barrett's",
  "Bell's",
  "Hodgkin's",
  "Raynaud's",
  "Alzheimer's",
  "Cushing's",
  "Down's",
  "Sweet's",
  "Horner's",
  "Kaposi's",
  "Peyronie's",
  "Merkel's",
  "Merkle's",
  'Muckle-Wells',
  'Lambert-Eaton',
  "Prinzmetal's",
]

export function arrayToString(names: any[]) {
  if (!names)
    return ''
  let tempString = ''
  for (var i = 0; i < names.length; i++) {
    tempString += names[i].fields?.name
    if (i === names.length - 1) break
    tempString += ','
  }
  return tempString
}

export function multiToTemplate(type: string, names: any[]) {
  let res = ""
  if (names) {
    if (names.length === 1)
      res = names[0].fields?.name
    else if (names.length > 1) {
      res = `${names.length} ${type}`
    }
  }
  return res
}

export function decapitalize(str: string) {
  if (str) {
    if (str[0] === '\t' || str[0] === ' ') {
      return str.trim()
    }
    str = str.trim()
    const firstWord = str.split(' ')[0]
    if (ABBR_EXCEPTIONS.includes(firstWord)) {
      return str
    }
    if (str.length < 2) {
      return str.toUpperCase()
    }
    if (str[1]?.toUpperCase() === str[1]) {
      return str
    }
    let decap = str[0]?.toLowerCase() + str.slice(1, str.length)
    for (const s of ABBR_EXCEPTIONS) {
      decap = decap.replace(s.toLowerCase() + ' ', s + ' ')
    }
    return decap
  }
  return ''
}

export const toTitlecase = (string) => {
  if (!string || string.length <= 1) {
    return string ?? ''
  }
  return string[0].toUpperCase() + string.slice(1,)
}

export const getLabel = (_component, _unit) => {
  let unit = ""
  if (_unit)
    unit = ` (${_unit})`
  return `${_component}${unit}`
}
