import { useEffect } from 'react';
import Contact from './Contact'

export default function Hero() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.twttr) {
      window.twttr.widgets.load();  // Memuat widget Twitter setelah komponen dirender
    }
  }, []);

  return (
    <>
      <section className="shift">
        <h4>Unhappy with your website?</h4>
        <h1 className="heading1">
          We create beautiful <br />and fast web services
        </h1>
      </section>
      <div>
          {/* <Image src="/heroImage.jpg" alt="teamwork on web services" width="1332px" height="354px"/> */}
          {/* Embed Tweet */}
        <blockquote className="twitter-tweet">
          <p lang="en" dir="ltr">
            Just setting up my Twitter. #myfirstTweet
          </p>
          &mdash; Twitter Dev (@TwitterDev) <a href="https://twitter.com/ryfazrin/status/1504760897176174595">February 8, 2025</a>
        </blockquote>

        {/* Embed Timeline */}
        <a
          className="twitter-timeline"
          data-width="550"
          data-height="400"
          href="https://twitter.com/ryfazrin/status/1504760897176174595"
        >
          Tweets by TwitterDev
        </a>
      </div>
      <section className="shift">
        <h1>Story, emotion <br/>and purpose</h1>
        <p>We help transform your ideas into real world applications that will outperform your toughest competition and help you achieve your strategic goals in short period of time.</p>
        <Contact />
      </section>

    <style jsx>{`

      .shift {
        margin: 0 0 0 2rem;
        width: 310px;
        padding: 1rem 0rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;
      }

      .borderRadius18 {
        margin: 0 10px;
        display: flex;
        justify-content: center;
        border-radius: 18px;
        height: 135px;
        background: url("/heroImage60.webp");
        background-size: 100% 100%;
        overflow: hidden;
      }

      @media (max-width: 600px) {
        .grid {
          width: 100%;
          flex-direction: column;
        }
      }
      
      @media only screen and (min-width: 540px) {
        .shift {
          margin: 0 0 0 10rem;
          padding: 2rem 0rem;
          width: 360px;
        }

        .heading1 {
            width: 540px;
        }
      
        .borderRadius18 {
          margin: 0 20px;
          left: -10rem;
          height: 254px;
          background-size: auto 100%;
        }
      }
      
      @media only screen and (min-width: 900px) {

        .shift {
          margin: 0 0 0 30vw;
          width: 360px;
        }
      
        .borderRadius18 {
          margin: 0 50px;
          left: -20rem;
          height: 354px;
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        
      }
    `}</style>
  </>
  )
}