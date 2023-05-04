export class MenuItem{
    private name: string;
    private icon: string;
    private subheading: string;    

    /**
     * Getter $name
     * @return {string}
     */
	public get $name(): string {
		return this.name;
	}

    /**
     * Getter $icon
     * @return {string}
     */
	public get $icon(): string {
		return this.icon;
	}

    /**
     * Getter $subheading
     * @return {string}
     */
	public get $subheading(): string {
		return this.subheading;
	}

    /**
     * Getter $link
     * @return {string}
     */
	public get $link(): string {
		return this.link;
	}

    /**
     * Setter $name
     * @param {string} value
     */
	public set $name(value: string) {
		this.name = value;
	}

    /**
     * Setter $icon
     * @param {string} value
     */
	public set $icon(value: string) {
		this.icon = value;
	}

    /**
     * Setter $subheading
     * @param {string} value
     */
	public set $subheading(value: string) {
		this.subheading = value;
	}

    /**
     * Setter $link
     * @param {string} value
     */
	public set $link(value: string) {
		this.link = value;
	}
    private link: string;


	constructor(name: string, icon?: string, subheading?: string, link?: string) {
        this.name = name;
        this.icon = icon;
        this.subheading = subheading;
        this.link = link;
	}

    

}