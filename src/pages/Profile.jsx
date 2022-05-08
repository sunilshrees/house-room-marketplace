import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    updateDoc,
    doc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
} from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';
import { db } from '../firebase-config';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import ListingItem from '../components/ListingItem';

function Profile() {
    const auth = getAuth();
    const [changeDetails, setChangeDetails] = useState(false);
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });

    const { name, email } = formData;

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listing');

            const q = query(
                listingsRef,
                where('userRef', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc')
            );
            const querySnap = await getDocs(q);

            const listings = [];

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setListings(listings);
            setLoading(false);
        };
        fetchUserListings();
    }, [auth.currentUser.uid]);

    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete?')) {
            await deleteDoc(doc(db, 'listing', listingId));
            const updatedListings = listings.filter(
                (listing) => listing.id !== listingId
            );
            setListings(updatedListings);
            toast.success('Successfully deleted listing');
        }
    };

    const onEdit = (listingId) => {
        navigate(`/edit-listing/${listingId}`);
    };

    const onLogout = () => {
        auth.signOut();
        navigate('/');
    };
    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                //update display name in firebase
                await updateProfile(auth.currentUser, { displayName: name });

                //update in firestore

                const userRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(userRef, {
                    name,
                });
            }
            toast.success('Profile updated');
        } catch (error) {
            toast.error('Could not update profile details');
        }
    };
    const onChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };
    return (
        <div className='profile'>
            <header className='profileHeader'>
                <p className='pageHeader'>My Profile</p>
                <button type='button' className='logOut' onClick={onLogout}>
                    LogOut
                </button>
            </header>
            <main>
                <div className='profileDetailsHeader'>
                    <p className='profileDetailsText'>Personal Details</p>
                    <p
                        className='changePersonalDetails'
                        onClick={() => {
                            changeDetails && onSubmit();
                            setChangeDetails((prev) => !prev);
                        }}>
                        {changeDetails ? 'Done' : 'Edit'}
                    </p>
                </div>

                <div className='profileCard'>
                    <form>
                        <input
                            type='text'
                            id='name'
                            className={
                                !changeDetails
                                    ? 'profileName'
                                    : 'profileNameActive'
                            }
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChange}
                            autoComplete='off'
                        />
                        <input
                            type='text'
                            id='email'
                            className={
                                !changeDetails
                                    ? 'profileEmail'
                                    : 'profileEmailActive'
                            }
                            disabled={true}
                            value={email}
                            // onChange={onChange}
                            autoComplete='off'
                        />
                    </form>
                </div>

                <Link to='/create-listing' className='createListing'>
                    <img src={homeIcon} alt='home' />
                    <p>Sell or Rent your home</p>
                    <img src={arrowRight} alt='arrow' />
                </Link>
                {!loading && listings?.length > 0 && (
                    <>
                        <p className='listingText'>Your Listings</p>
                        <ul className='listingDetailsList'>
                            {listings.map((listing) => {
                                return (
                                    <ListingItem
                                        key={listing.id}
                                        listing={listing.data}
                                        id={listing.id}
                                        onDelete={() => onDelete(listing.id)}
                                        onEdit={() => onEdit(listing.id)}
                                    />
                                );
                            })}
                        </ul>
                    </>
                )}
            </main>
        </div>
    );
}

export default Profile;
