import { LocationTypeId } from 'models/location'
import { FC } from 'react'
import { Button } from 'react-bootstrap'

interface Props {
    location: LocationTypeId
}

const LocationCard: FC<Props> = ({ location }) => {
    return (
        <div className="location-card">
            <img className="location-card-img" src={`${process.env.REACT_APP_LARAVEL_API_URL}${location.image}`} alt="Location" />
            <Button className="btn btn-secondary location-card-button">Guess</Button>
        </div>
    )
}

export default LocationCard
