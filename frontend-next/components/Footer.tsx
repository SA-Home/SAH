import Link from "next/link";

export default function Footer() {
  return (
    <footer className="home-footer">
      <div className="footer-columns">
        <section>
          <h2>Our Office</h2>
          <p>
            Tshimologong Digital Precinct, 41 Juta Street,
            <br />
            Braamfontein, Johannesburg, South Africa
          </p>
        </section>

        <section>
          <h2>Useful Links</h2>
          <Link href="#">Advertise</Link>
          <Link href="/magazines">Magazines</Link>
          <Link href="/directory">About Us</Link>
          <Link href="/directory">Contact Us</Link>
          <Link href="#">Privacy Policy for SA Homeschooling &amp; Beyond</Link>
          <Link href="/subscribe">Subscribe</Link>
        </section>

        <section>
          <h2>Follow Us</h2>
          <div className="social-links">
            <Link href="#" aria-label="Facebook">
              <span aria-hidden="true">f</span>
            </Link>
            <Link href="#" aria-label="Instagram">
              <span aria-hidden="true">ig</span>
            </Link>
            <Link href="#" aria-label="LinkedIn">
              <span aria-hidden="true">in</span>
            </Link>
            <Link href="#" aria-label="X">
              <span aria-hidden="true">x</span>
            </Link>
          </div>
        </section>
      </div>

      <div className="footer-bottom">
        <span>&copy; 2026 The Digital Afrikan &nbsp; Powered by Newspack</span>
        <Link href="#">Privacy Policy for SA Homeschooling &amp; Beyond</Link>
      </div>
    </footer>
  );
}
