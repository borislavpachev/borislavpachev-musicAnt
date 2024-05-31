import { PropTypes } from 'prop-types';
import './ProfileCard.css';

export default function ProfileCard({ user }) {
  return (
    <div
      className={`custom-profile-card d-flex align-items-center p-2 rounded bg-success`}
    >
      <img
        src={`${user?.images[1].url}`}
        style={{
          height: '150px',
          width: '150px',
          borderRadius: '50%',
        }}
      />
      <div className="d-flex flex-column align-items-center mx-3 text-white">
        <h3>{user.display_name}</h3>
        <span style={{ whiteSpace: 'nowrap' }}>Country: {user.country}</span>
        <span>Followers: {user.followers.total}</span>
      </div>
    </div>
  );
}

ProfileCard.propTypes = {
  user: PropTypes.object,
};
