import axios from 'axios'

const GET_DEPENDENCIES = 'https://registry.npmjs.cf/'

export const getDependencies = async (packageName: string) => {
  const result = await axios({
    url: GET_DEPENDENCIES + packageName,

  })

  return result
}
