import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase-config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import './listing.css';

function Listing() {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [main, setMain] = useState();

    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listing', params.listingId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
            }
        };

        fetchListing();
        listing && setMain(listing.imgUrls[0]);
    }, [navigate, params.listingId, listing?.imgUrls[0]]);

    // console.log(listing);

    if (loading) {
        return <Spinner />;
    }

    return (
        <main className='saleContainer'>
            <div
                className='shareIconDiv'
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setShareLinkCopied(true);
                    setTimeout(() => {
                        setShareLinkCopied(false);
                    }, 2000);
                }}>
                <img src={shareIcon} alt='' />
            </div>

            {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

            <div className='product-center'>
                <div className='imgContainer'>
                    <img src={main} alt='main' className='main' />
                    {listing.offer && (
                        <h4 className='discount'>
                            -
                            {Math.round(
                                ((listing.regularPrice -
                                    listing.discountedPrice) *
                                    100) /
                                    listing.regularPrice
                            )}
                            % off
                        </h4>
                    )}
                    <div className='gallery'>
                        {listing.imgUrls.map((image, index) => {
                            return (
                                <img
                                    src={image}
                                    key={index}
                                    onClick={() =>
                                        setMain(listing.imgUrls[index])
                                    }
                                    className={`${
                                        image === main
                                            ? 'galleyImage active'
                                            : 'galleryImage'
                                    }`}
                                />
                            );
                        })}
                    </div>
                </div>
                <section className='content'>
                    <h2>{listing.name}</h2>

                    <h3 className='price'>
                        $
                        {listing.offer
                            ? listing.discountedPrice
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : listing.regularPrice
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </h3>
                    <h4>Location: {listing.location}</h4>
                    <h4>Services : </h4>
                    {/* {listing.offer && (
                        <h4>
                            ${listing.regularPrice - listing.discountedPrice}{' '}
                            discount
                        </h4>
                    )} */}

                    <h4>
                        Bedrooms :
                        {listing.bedrooms > 0 ? (
                            <span> {listing.bedrooms}</span>
                        ) : null}
                    </h4>
                    <h4>
                        Bathrooms :
                        {listing.bathrooms ? (
                            <span> {listing.bathrooms}</span>
                        ) : null}
                    </h4>
                    <h4>
                        Parking Spot :
                        {listing.parking ? (
                            <span> Available</span>
                        ) : (
                            <span> Not Available</span>
                        )}
                    </h4>
                    <h4>
                        Furnished :
                        {listing.furnished ? (
                            <span> Yes</span>
                        ) : (
                            <span> No</span>
                        )}
                    </h4>
                    <p></p>
                </section>
            </div>
            {auth.currentUser?.uid !== listing.userRef && (
                <Link
                    to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                    className='contactButton'>
                    Contact Landlord
                </Link>
            )}
        </main>
    );
}

export default Listing;

// https://stackoverflow.com/questions/67552020/how-to-fix-error-failed-to-compile-node-modules-react-leaflet-core-esm-pat
