import  "../style/components.css"

export default function Content ({children}: any)
{
	return (
		<div className="content-body">
			{children}
		</div>
	)
}
