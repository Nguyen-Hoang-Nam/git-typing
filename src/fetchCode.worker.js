self.onmessage = ({ data: { url } }) => {
    fetch("https://raw.githubusercontent.com/" + url).then((res) => {
        res.text().then((data) => {
            self.postMessage({ originalData: data });
        });
    });
};
