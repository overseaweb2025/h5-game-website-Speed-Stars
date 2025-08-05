import 'server-only'
import { dictionaries, Locale } from './dictionaraies';


export const getDictionary = async (locale: Locale) => dictionaries[locale]().then((dict) => dict || {});