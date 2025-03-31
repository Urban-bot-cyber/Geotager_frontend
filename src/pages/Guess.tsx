import GuessForm from 'components/guess/GuessForm'
import Layout from 'components/ui/Layout'

const GuessLocation: React.FC = () => {
  
    return (
        <Layout>
        <div className="p-5 mb-4">
            <div className="container-fluid py-4">
                <GuessForm />
            </div>
        </div>
    </Layout>
    )
  }
  
  export default GuessLocation