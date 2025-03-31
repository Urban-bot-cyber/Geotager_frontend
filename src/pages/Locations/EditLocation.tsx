import EditLocationForm from 'components/location/EditLocationForm'
import Layout from 'components/ui/Layout'

const AddLocation: React.FC = () => {
  
    return (
        <Layout>
        <div className="p-5 mb-4">
            <div className="container-fluid py-4">
                <EditLocationForm />
            </div>
        </div>
    </Layout>
    )
  }
  
  export default AddLocation