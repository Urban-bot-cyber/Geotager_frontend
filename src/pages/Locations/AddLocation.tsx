import AddLocationForm from 'components/location/AddLocationForm'
import Layout from 'components/ui/Layout'

const AddLocation = () => {
    return (
        <Layout>
            <div className="p-2 mb-4">
                <div className="container-fluid py-4">
                    <AddLocationForm />
                </div>
            </div>
        </Layout>
    )
}

export default AddLocation
