import React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { db } from '../firebase-config';
import {
    setDoc,
    doc,
    serverTimeStamp,
    serverTimestamp,
} from 'firebase/firestore';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import OAuth from '../components/OAuth';

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const { name, email, password } = formData;

    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            updateProfile(auth.currentUser, {
                displayName: name,
            });

            // store data to database

            const formDataCopy = { ...formData };
            delete formDataCopy.password; //database ma nalagna
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, 'users', user.uid), formDataCopy);

            navigate('/');
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    return (
        <>
            <div className='pageContainer'>
                <header>
                    <p className='pageHeader'>Welcome Back!</p>
                </header>
                <main>
                    <form onSubmit={onSubmit}>
                        <input
                            type='text'
                            className='nameInput'
                            placeholder='Name'
                            id='name'
                            value={name}
                            onChange={onChange}
                            autoComplete='off'
                        />
                        <input
                            type='email'
                            className='emailInput'
                            placeholder='Email'
                            id='email'
                            value={email}
                            onChange={onChange}
                            autoComplete='off'
                        />
                        <div className='passwordInputDiv'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className='passwordInput'
                                placeholder='Password'
                                id='password'
                                value={password}
                                onChange={onChange}
                                autoComplete='off'
                            />
                            <img
                                src={visibilityIcon}
                                alt='show password'
                                className='showPassword'
                                onClick={() => {
                                    setShowPassword((prevState) => !prevState);
                                }}
                            />
                        </div>

                        <div className='signUpBar'>
                            <p className='signUnText'>Sign Up</p>
                            <button className='signUpButton'>
                                <ArrowRightIcon
                                    fill='white'
                                    width='34px'
                                    height='34px'
                                />
                            </button>
                        </div>
                    </form>

                    {/* google oauth */}

                    <OAuth />

                    <Link to='/sign-in' className='registerLink'>
                        Sign In Instead
                    </Link>
                </main>
            </div>
        </>
    );
}

export default SignUp;
