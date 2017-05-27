import Layout from '../components/Layout'
import Preview from '../components/Preview'

export default () => (
  <Layout>
    <div className="row">
      <div className="col-8">
        <Preview/>
      </div>
      <div className="col-4">hello</div>
    </div>
  </Layout>
)