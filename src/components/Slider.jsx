import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import './slider.css';
import next from '../assets/png/next.png';
import previous from '../assets/png/previous.png';

function Slider({ loading, listings }) {
    const [index, setIndex] = useState(1);

    useEffect(() => {
        const lastIndex = listings.length - 1;
        if (index < 0) {
            setIndex(lastIndex);
        }
        if (index > lastIndex) {
            setIndex(0);
        }
    }, [index, listings]);

    useEffect(() => {
        let slider = setInterval(() => {
            setIndex(index + 1);
        }, 7000);
        return () => {
            clearInterval(slider);
        };
    }, [index]);

    if (loading) {
        return <Spinner />;
    }

    if (listings.length === 0) {
        return <></>;
    }

    return (
        <div className='container-slider'>
            {listings.map((obj, i) => {
                let position = 'nextSlide';
                if (i === index) {
                    position = 'activeSlide';
                }
                if (
                    i === index - 1 ||
                    (index === 0 && i === listings.length - 1)
                ) {
                    position = 'lastSlide';
                }
                return (
                    <article key={obj.id} className={position}>
                        <img src={obj.data.imgUrls[0]} />
                    </article>
                );
            })}

            {/* <BtnSlider moveSlide={nextSlide} direction={'next'} />
            <BtnSlider moveSlide={prevSlide} direction={'prev'} /> */}
            <div className='golo'>
                <div className='prev' onClick={() => setIndex(index - 1)}>
                    <img src={previous} alt='prev' />
                </div>
            </div>
            <div className='golo'>
                <div className='next' onClick={() => setIndex(index + 1)}>
                    <img src={next} alt='next' />
                </div>
            </div>
        </div>
    );
}

export default Slider;
