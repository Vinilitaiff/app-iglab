import { gql, useQuery } from "@apollo/client"
import { getAccessToken, useUser, withPageAuthRequired } from "@auth0/nextjs-auth0"
import { useGetProductsQuery } from "../../graphql/generated/graphql"
import { getServerPageGetProducts, ssrGetProducts } from "../../graphql/generated/page"
import { withApollo } from "../../lib/withApollo"


function Home({data}) {
  const { user } = useUser()
  //const {data, loading, error} = useGetProductsQuery()

  return (
    <div>
      <h1>Bem vindo</h1>
      <pre>
        {JSON.stringify(data.products, null, 2)}
      </pre>
      <pre>
        {JSON.stringify(user, null, 2)}
      </pre>

      {/* <a href="/api/auth/logout">Logout</a> */}
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {    
      return await getServerPageGetProducts(null, ctx)    
  }

});

export default withApollo(ssrGetProducts.withPage()(Home)) 