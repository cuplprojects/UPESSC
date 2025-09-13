import React from "react";
import upesccLogo from "../../Assets/upescc.jpeg";

const Interview = () => {
  return (
    <div
      style={{
        fontFamily: "'Times New Roman', serif",

        margin: 0,
        padding: "20px",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "1000px",
          margin: "auto",

          border: "5px solid black",
          padding: "30px",

          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Watermark Logo */}
        <img
          src={upesccLogo}
          alt="Watermark"
          style={{
            position: "absolute",
            top: "54%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.3,        // clearer watermark
            width: "655px",
            // bigger size
            zIndex: 0,
            pointerEvents: "none", // don’t block text
          }}
        />


        {/* Content Above Watermark */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div
            className="text-center mb-4"
            style={{ textAlign: "center", marginBottom: "1rem" }}
          >
            {/* Logo + Header in one line */}
            <div style={{ width: "100%" }}>
              {/* Logo + Heading + Address in one row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  position: "relative",
                }}
              >
                {/* Logo on left */}
                <img
                  src={upesccLogo}
                  alt="UPESSC Logo"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "contain",
                    marginRight: "15px",
                  }}
                />

                {/* Heading + Address centered */}
                <div style={{ textAlign: "center" }}>
                  <h2
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                      fontSize: "30px",
                    }}
                  >
                    उत्तर प्रदेश शिक्षा सेवा चयन आयोग
                  </h2>
                  <p
                    style={{
                      marginTop: "5px",
                      marginBottom: "5px",
                      fontSize: "16px",
                    }}
                  >
                    23 एलनगंज, प्रयागराज – 211002
                  </p>
                </div>
              </div>

              {/* Underline */}
              <div
                style={{
                  borderBottom: "2px solid black",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
              ></div>

              {/* PROVISIONAL bottom-right under underline */}
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>
                  PROVISIONAL
                </p>
              </div>
            </div>

          </div>


          {/* Title */}
          <div
            className="text-center my-4"
            style={{ textAlign: "center", margin: "1rem 0" }}
          >
            <div style={{ textAlign: "center", fontWeight: "bold" }}>
              <h3
                style={{
                  margin: "0",
                  fontWeight: "bold",
                  display: "inline-block",   // keeps underline only as wide as text
                  borderBottom: "3px solid black", // single thick underline
                  paddingBottom: "4px",
                }}
              >
                सहायक आचार्य (विज्ञापन संख्या – 51)
                <p style={{ margin: "5px 0 0 0", fontWeight: "bold" }}>
                  चयन परीक्षा – 2022
                </p>
              </h3>

            </div>

            <p
              style={{
                fontWeight: "bold",
                display: "inline-block",       // underline only as wide as text
                borderBottom: "1px solid black", // dark underline
                paddingBottom: "4px",
                margin: "10px 0",
              }}
            >
              साक्षात्कार-पत्र (औपबं‍धिक)
            </p>

          </div>

          {/* Candidate Info */}
          <div
            className="grid mb-4"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 200px",
              gap: "20px",
              marginBottom: "1rem",
            }}
          >
            <div>
              <p>अभ्यर्थी / अभ्यर्थिनी का नाम : __________________________</p>
              <p>पिता / पति का नाम : __________________________</p>
              <p>श्रेणी : __________________________</p>
              <p>विषय : __________________________</p>
              <p>पंजीकरण संख्या : __________________________</p>
              <p>अनुक्रमांक : __________________________</p>
            </div>

            {/* Photo box */}
            <div
              className="photo-box"
              style={{
                border: "3px solid black",
                height: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <p style={{ margin: "5px 0", fontSize: "14px" }}>अभ्यर्थी की फोटो</p>
              <div
                style={{
                  borderTop: "3px solid black",
                  width: "200px",
                  textAlign: "center",
                  marginTop: "auto",
                  paddingTop: "10px",
                }}
              >
                <p style={{ margin: "5px 0", fontSize: "14px" }}>हस्ताक्षर</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="mb-6" style={{ marginBottom: "1.5rem" }}>
            <p>
              प्रिय महोदय / महोदया, <br /> सहायक आचार्य(विज्ञापन संख्या - 51) हेतु
              आयोजित लिखित परीक्षा में आपको औबन्धिवा रूप से सफल घोषित किया गया है।
              आपका साक्षात्कार निम्नलिखित निर्धारित कार्यक्रम के अनुसार आयोजित
              किया जाएगा।
            </p>
            <p>
              अनुरोध है कि आयोग की वेबसाइट पर उपलब्ध आवश्यक सूचना / महत्वपूर्ण
              अनुदेशों को भली - भांति अध्ययन कर लें, तेवनुपरान्त विज्ञापन में
              वर्णित आवश्यक योग्यता धारक अभ्यर्थी / अभ्यर्थिनी अपने समरत
              अभिलेखों की मूल प्रतियों एवं पोर्टल पर सूचनाओं के संगत अपलोड किये
              गये अभिलेखों की छायाप्रतियों सहित निर्धारित तिथि, समय तथा स्थान पर
              स्वयं उपस्थित होने का कष्ट करें। निर्धारित तिथि, समय व स्थान पर
              उपस्थित नहीं होने पर अंतिम चयन के लिए विचार नहीं किया जाएगा।
            </p>
            <p className="mt-2" style={{ marginTop: "0.5rem" }}>
              कृपया निर्धारित तिथि, समय तथा स्थान पर आवश्यक दस्तावेज़ों के साथ
              उपस्थित होना सुनिश्चित करें।
            </p>
          </div>

          {/* Schedule Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "1.5rem",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    textAlign: "center",
                    backgroundColor: "#333333",
                    color: "white",
                  }}
                >
                  विवरण
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    textAlign: "center",
                    backgroundColor: "#333333",
                    color: "white",
                  }}
                >
                  दिनांक, दिन और रिपोर्टिंग समय
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    textAlign: "center",
                    backgroundColor: "#333333",
                    color: "white",
                  }}
                >
                  स्थान
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  साक्षात्कार
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  दिनांक: __________ <br />
                  दिन: ________ <br /> समय: 09:00 बजे प्रातः
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  उत्तर प्रदेश शिक्षा सेवा चयन आयोग <br />
                  23, एलनगंज, प्रयागराज – 211002
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div

            style={{ textAlign: "center", marginTop: "1rem" }}
          >
            <p>सचिव</p>
            <p>उत्तर प्रदेश शिक्षा सेवा चयन आयोग</p>
            <p>प्रयागराज |</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
