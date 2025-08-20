export async function fetchCountries() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2,flags');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.map(country => ({
      code: country.cca2,
      dialCode: country.idd?.root
        ? country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : '')
        : '',
      flag: country.flags?.emoji || '',
      name: country.name.common,
    })).filter(c => c.dialCode);
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return [];
  }
}
