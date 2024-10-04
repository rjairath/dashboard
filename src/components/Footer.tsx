"use client";

import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const githubUrl = "https://github.com/rjairath";
const linkedInUrl = "https://www.linkedin.com/in/rishabh-jairath/";
const twitterUrl = "https://x.com/rishabh_jairath";

const Footer = () => {
    const handleRedirect = (url: string) => {
        window.open(url, '_blank');
    }

    return (
		<div
			id="footer"
			className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
		>
			<div className="mx-auto max-w-4xl py-4 px-8 text-center flex justify-center items-center gap-8 mb-4">
				<span>
					<FaGithub size={'1.5rem'} className="cursor-pointer" 
                        onClick={() => handleRedirect(githubUrl)}
                    />
				</span>
				<span>
					<FaTwitter size={'1.5rem'} className="cursor-pointer" 
                        onClick={() => handleRedirect(twitterUrl)}
                    />
				</span>
				<span>
					<FaLinkedin size={'1.5rem'} className="cursor-pointer" 
                        onClick={() => handleRedirect(linkedInUrl)}
                    />
				</span>
			</div>
		</div>
	);
}

export default Footer