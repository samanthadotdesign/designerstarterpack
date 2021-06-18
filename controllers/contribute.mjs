export default function initContributeCountroller() {
  const index = (req, res) => {
    res.render('about');
  };

  const form = (req, res) => {
    res.render('contribute');
  };

  return { index, form };
}
