const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (

        <>
            <footer className="bg-light-gray text-white">
                <div className="container mx-auto py-5 text-center text-dark-blue">
                    &copy; {currentYear} MileFlow App. All Rights reserved.
                </div>
            </footer>
        </>
    )
}
export default Footer;