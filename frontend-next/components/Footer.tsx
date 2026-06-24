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
              f
            </Link>
            <Link href="#" aria-label="Instagram">
              ig
            </Link>
            <Link href="#" aria-label="LinkedIn">
              in
            </Link>
            <Link href="#" aria-label="X">
              x
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
