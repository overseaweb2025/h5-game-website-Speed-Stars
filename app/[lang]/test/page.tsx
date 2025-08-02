const content = `
<section style="
  background-color: #111827;
  min-height: 100vh;
  padding: 3rem 0;
  font-family: Inter, Roboto, 'Helvetica Neue', Arial, sans-serif;
">
  <div style="
    max-width: 72rem;
    margin: 0 auto;
    padding: 0 1rem;
  ">
    <div style="
      text-align: center;
      margin-bottom: 1.5rem;
    ">
      <h2 style="
        color: #f9fafb;
        margin-bottom: 0.5rem;
        font-size: 3rem;
        font-weight: 900;
        line-height: 1;
        text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);
      ">
        About <span style="color: #a855f7;">Speed Stars</span>
      </h2>
      <p style="
        color: rgba(249, 250, 251, 0.8);
        max-width: 48rem;
        margin: 0 auto;
        font-size: 1.125rem;
        line-height: 1.75rem;
      ">
        Speed Stars is a dynamic track and field game that puts players in the fast lane of short-distance sprints. The game offers a satisfying mix of precision, timing, and high-speed thrills with various running competitions of different distances, rewarding skill and practice.
      </p>
    </div>

    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    " class="md-flex-row">
      <div style="
        width: 100%;
        max-width: 50%;
      " class="md-width-half">
        <div style="
          position: relative;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          margin-bottom: 0.75rem;
        ">
          <img 
            style="
              width: 100%;
              height: auto;
              display: block;
            "
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/speed-stars-game1.jpg-pdS6H7q96A7xUAYFjD69vZqEk1f6WG.jpeg" 
            alt="Speed Stars racing game showing colorful runners on a track in a stadium" 
            width="1200" 
            height="675"
          />
        </div>
        <h3 style="
          font-size: 1.25rem;
          font-weight: 700;
          text-align: center;
          color: #f9fafb;
          margin-bottom: 0.75rem;
          text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);
        ">
          Speed Stars: Race, Rank, and Reach the Champion!
        </h3>
      </div>

      <div style="
        width: 100%;
        max-width: 50%;
      " class="md-width-half">
        <h3 style="
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #f9fafb;
          text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);
        ">
          Speed Stars Unblocked - Play Free Online
        </h3>
        <p style="
          margin-bottom: 0.75rem;
          color: rgba(249, 250, 251, 0.8);
          line-height: 1.6;
        ">
          Speed Stars isn't your typical racing game. It's a physics-based sprinting experience packed with humor, intensity, and quirky challenges. As you take control of a wobbly-legged athlete, your mission is to run as fast as possible without tripping over yourself — easier said than done!
        </p>
        <p style="
          margin-bottom: 1rem;
          color: rgba(249, 250, 251, 0.8);
          line-height: 1.6;
        ">
          The awkward movement mechanics and ragdoll animations create endless laugh-out-loud moments, making each race a blend of skill and pure chaos. Available completely free online, Speed Stars Unblocked can be played on any device without restrictions.
        </p>
      </div>
    </div>
  </div>

  <style>
    @media (min-width: 768px) {
      .md-flex-row {
        flex-direction: row !important;
      }
      .md-width-half {
        width: 50% !important;
        max-width: 50% !important;
      }
    }
  </style>
</section>
`;

export default function TestPage() {
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: content }}
      style={{ minHeight: '100vh' }}
    />
  )
}