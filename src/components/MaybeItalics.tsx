import React from "react";

export default function MaybeItalicize({
	group,
	name,
}: {
	group: string;
	name: string;
}) {
	if (group === "species" || group === "genus") {
		return <i>{name}</i>;
	} else {
		return <>{name}</>;
	}
}
