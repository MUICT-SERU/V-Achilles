import { client } from 'lib/gql';
import { gql } from '@apollo/client';

export async function queryVulnerability(packageName: string) {
  const vulnerability = await client.query({
    query: gql`
      query {
        securityVulnerabilities(first: 100, ecosystem: NPM, package: "${packageName}") {
          #totalCount
          nodes {
            package {
              name
            }
            firstPatchedVersion {
              identifier
            }
            severity
            vulnerableVersionRange
            advisory {
              identifiers {
                type
                value
              }
              permalink
            }
          }
        }
      }
    `,
  });

  return vulnerability;
}

export async function githubAuth() {
  const authResult = await client.query({
    query: gql`
      query {
        viewer {
          login
        }
      }
    `,
  });

  return authResult;
}

export const queryCwes = async (ghsaId: string) => {
  const securityAdvisory = await client.query({
    query: gql`
      query {
        securityAdvisory(ghsaId: "${ghsaId}") {
          cwes(first: 10) {
            nodes {
              cweId
              name
            }
          }
        }
      }
    `,
  });

  return securityAdvisory.data.securityAdvisory.cwes.nodes;
};
