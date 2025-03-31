import React from 'react'
import { useQuery } from 'react-query'
import { getRecentUserActions } from 'api/Api'
import { Table } from 'react-bootstrap'

const ActivityLog: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery('recentUserActions', getRecentUserActions)

  if (isLoading) return <div>Loading...</div>
  if (isError) {
    console.error(error)
    return <div>Error loading recent actions</div>
  }

  // If your backend returns: { message: "...", data: [ ... ] }
  // and you want data nested, ensure your controller or code matches
  const actions = data?.data.data || []

  return (
    <><h1 style={{color: '#619B8A' }}>Activity log</h1><div className="activity-log-container" style={{color: '#619B8A' }}>


      <Table className="activity-table" hover responsive>
        <thead>
          <tr>
            <th>User</th>
            <th>Date/Time</th>
            <th>Action</th>
            <th>Component type</th>
            <th>New value</th>
            <th>Location of action</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action: any) => {
            const user = action.user
            const firstName = user?.first_name || ''
            const lastName = user?.last_name || ''
            const profilePic = user?.profile_picture

            return (
              <tr key={action.id}>
                {/* User Column */}
                <td>
                  <div className="d-flex align-items-center">
                    {/* Profile picture */}
                    {profilePic ? (
                      <img
                        src={`${process.env.REACT_APP_LARAVEL_API_URL}storage/${profilePic}`}
                        alt="User Avatar"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginRight: '8px',
                        }} />
                    ) : (
                      // If there's no profile picture, show a fallback
                      <img
                        src="/images/GeotaggerAssets/Avatar.png"
                        alt="Default Avatar"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginRight: '8px',
                        }} />
                    )}
                    {/* User name */}
                    <span className='user-name '>{firstName} {lastName}</span>
                  </div>
                </td>

                {/* Date/Time Column */}
                <td>
                  {new Date(action.created_at).toLocaleString()}
                </td>

                {/* Action Column */}
                <td>{action.action}</td>

                {/* Component Type Column */}
                <td>{action.component_type || '—'}</td>

                {/* New Value Column */}
                <td>{action.new_value || '—'}</td>

                {/* Location of Action Column */}
                <td>{action.url}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div></>
  )
}

export default ActivityLog