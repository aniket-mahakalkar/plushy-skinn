import LeatherPanel from '@/components/site/LeatherPanel'
import Reveal from '@/components/site/Reveal'
import './our-story.css'

const principles = [
  {
    title: 'The zipper that sits flush',
    text: 'Hardware is chosen and placed so it disappears into the design, not sits on top of it.',
  },
  {
    title: 'The card that comes out in under a second',
    text: 'Every slot, fold, and seam is measured against how it performs in the hand, not just how it photographs.',
  },
  {
    title: 'The wallet that looks right in five years',
    text: 'Designed to age quietly and well, without needing to announce itself.',
  },
]

export default function OurStoryPage() {
  return (
    <>
      <section className="story-hero">
        <div className="container story-hero__grid">
          <div>
            <span className="eyebrow">Our story</span>
            <h1>The material was the starting point.</h1>
            <p>
              Plushy Skinn began with a question most accessory brands haven&rsquo;t
              asked: what if the material itself was the starting point, not an
              afterthought?
            </p>
            <p>
              We make wallets, bags, and travel goods from plant-based leather
              alternatives. Not because it is the easiest choice. Because it is the
              more considered one.
            </p>
          </div>
          <div className="story-hero__visual">
            <LeatherPanel color="#a9793f" stitch={false} />
          </div>
        </div>
      </section>

      <section className="position">
        <div className="container">
          <Reveal className="position__quote">
            <p>
              We are not a sustainability brand that also makes products. We are a
              design brand that has made a deliberate choice about materials &mdash;
              and we are honest about where that choice still has room to evolve.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="values">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">Function first</span>
            <h2>Every decision is measured against what can be removed</h2>
          </Reveal>
          <div className="values__grid">
            {principles.map((v, i) => (
              <Reveal key={v.title} delay={i * 80} className="values__item">
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="origin">
        <Reveal className="container origin__inner">
          <p className="origin__line">Indian in origin.</p>
          <p className="origin__line origin__line--accent">Global in design thinking.</p>
        </Reveal>
      </section>

      <section className="closing">
        <Reveal className="container closing__inner">
          <p>We don&rsquo;t claim perfection.</p>
          <p className="closing__accent">We claim direction.</p>
        </Reveal>
      </section>
    </>
  )
}
