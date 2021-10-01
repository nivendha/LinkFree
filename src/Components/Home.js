import './Home.css'

import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { ProgressBar } from 'primereact/progressbar'
import { Skeleton } from 'primereact/skeleton'
import { Avatar } from 'primereact/avatar'

function Home() {
  const [showProgress, setShowProgress] = useState(true)
  const [list, setList] = useState([])
  useEffect(() => {
    fetch('/list.json')
      .then((response) => response.json())
      .then((data) => {
        setList(data)
      })
      .catch((error) => {
        console.log('Home useEffect', error)
        alert('An error occurred please try again later.')
      })
      .finally(() => setShowProgress(false))
  }, [])

  return (
    <main>
      {showProgress && <ProgressBar mode="indeterminate" />}
      {list.map((user, key) => (
        <a href={`${user.username}`} key={`avatar-${key}`}>
          <Avatar
            image={user.avatar}
            shape="circle"
            size="xlarge"
            className="p-m-2"
            template={<ImageLoader avatar={user.avatar} username={user.username}/>}
            imageAlt={user.username}
          />
        </a>
      ))}
    </main>
  )
}

const ImageLoader = ({ avatar, username }) => {
  const imgEl = useRef(null)
  const [loaded, setLoaded] = React.useState(false)

  const onImageLoaded = () => {
    setLoaded(true)
  }

  useEffect(() => {
    const imgElCurrent = imgEl.current

    if (imgElCurrent) {
      imgElCurrent.addEventListener('load', onImageLoaded)
      return () => imgElCurrent.removeEventListener('load', onImageLoaded)
    }
  }, [])

  return (
    <>
      <img
      ref={imgEl}
      src={'https://avatars.githubusercontent.com/' + username}
      alt={username}
      style={loaded ? { display: 'inline-block' } : { display: 'none' }}
    />
    {!loaded && <Skeleton className="p-avatar" shape="circle" size="75px"/>}
    </>
  )
}
ImageLoader.propTypes = {
  avatar: PropTypes.string,
  username: PropTypes.string,
}
export default Home
