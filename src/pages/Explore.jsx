import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';
import Slider from '../components/Slider';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase-config';

function Explore() {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, 'listing');
            const q = query(
                listingsRef,
                orderBy('timestamp', 'desc'),
                limit(5)
            );
            const querySnap = await getDocs(q);

            let listings = [];

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });

            setListings(listings);
            setLoading(false);
        };

        fetchListings();
    }, []);

    return (
        <div className='explore'>
            <header>
                <p className='pageHeader'>Explore</p>
            </header>

            <main>
                {listings && <Slider loading={loading} listings={listings} />}

                <p className='exploreCategoryHeading'>Categories</p>
                <div className='exploreCategories'>
                    <Link to='/category/rent'>
                        <img
                            src={rentCategoryImage}
                            alt='rent'
                            className='exploreCategoryImg'
                        />
                        <p className='exploreCategoryName'>Places for rent</p>
                    </Link>
                    <Link to='/category/sale'>
                        <img
                            src={sellCategoryImage}
                            alt='Sale'
                            className='exploreCategoryImg'
                        />
                        <p className='exploreCategoryName'>Places for Sale</p>
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default Explore;
