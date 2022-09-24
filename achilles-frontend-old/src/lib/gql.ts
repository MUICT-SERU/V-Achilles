import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import jwt from 'jsonwebtoken'

// const GITHUB_PAT: string = 'bd51596aa8874569be8832eb29b9527345ae0833'
const token: string = localStorage.getItem('token') || ''
const GITHUB_PAT: string = jwt.decode(token).access_token

const ENDPOINT: ApolloLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
})

const authLink = setContext(() => {
    // get the authentication token from local storage if it exists
    // const token = localStorage.getItem('token') || GITHUB_PAT
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        // authorization: token ? `Bearer ${token}` : "",
        authorization: `Bearer ${GITHUB_PAT}`,
      }
    }
  })

export const client = new ApolloClient({
  link: authLink.concat(ENDPOINT),
  cache: new InMemoryCache()
})

