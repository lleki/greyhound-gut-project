export function AboutTab() {
  return (
    <div className="about-body">
      <p>
        <h2>Background</h2>
        Racing greyhounds are known to carry hookworms at higher rates than many
        other dogs, and treatment-resistant hookworms have been reported in
        greyhounds from the United States, Ireland, and Australia. When these
        dogs retire and are adopted, their new owners — and vets unfamiliar with
        the problem — often cycle through ineffective treatments for months.
      </p>
      <p>
        Today, most adopters looking for information end up searching Facebook
        groups, Reddit threads, rescue forums, or asking other owners. While
        helpful, these sources are often fragmented. It's hard to see how many
        dogs used a particular protocol, where they came from, when treatment
        occurred, or whether results have changed over time. This project aims
        to bring those experiences together in one place.
      </p>
      <h2>Mission</h2>
      <p>
        This project is a{" "}
        <strong>community-driven database built by greyhound owners</strong>.
        All submissions are self-reported and are not independently verified. As
        we operate on an honor system, the value of these results depend
        entirely on participants providing accurate and honest information. We
        hope everyone can provide honest submissions to help the entire
        community better understand trends in hookworm treatment outcomes,
        geographic patterns, and greyhound origins.
      </p>
      <p>
        <h2>Self Reporting</h2>
        These results should be treated as a directional signal, not clinical
        evidence. Because of its nature, we hope that we can capture emerging
        trends more quickly than formal studies or published reports. But its
        limitation is that the information is self-reported and may contain
        errors, omissions, or reporting bias. Please use the information
        responsibly and always discuss treatment decisions with your
        veterinarian.
      </p>
      <p>
        Inspired by the work of <strong>Dr. Jennifer Ng, DVM</strong> and the{" "}
        <strong>Kaplan Lab at the University of Georgia</strong>. Built by an
        NGA greyhound adopter.
      </p>
      <p style={{ fontSize: "0.78rem", color: "#a09d94" }}>
        Data collected is about dogs, not people. No personal identifying
        information is stored. Location is collected at city or town level only.
        Submissions are voluntary and viewable in aggregate. To remove or
        correct a submission, use the Update record tab or flag it for
        maintainer review.
      </p>
    </div>
  );
}
