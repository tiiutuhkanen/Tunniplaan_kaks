function Search(searchElm, resElm){
	this.searchElm = searchElm;
	this.resElm = resElm;

	this.getSearchData = async function (){
		let raw

		raw = await fetch("https://be.ta19heinsoo.itmajakas.ee/api/teachers")
		let teachers = await raw.json()

		raw = await fetch("https://be.ta19heinsoo.itmajakas.ee/api/rooms")
		let rooms = await raw.json()

		raw = await fetch("https://be.ta19heinsoo.itmajakas.ee/api/groups")
		let groups = await raw.json()

		return {teachers: teachers, rooms: rooms, groups: groups}
	}

	this.search = async function (inp){
		if(inp != ""){
			let res = {}

			let regex = new RegExp(inp, "i")

			console.log(this.data)
			this.data.teachers.forEach(obj => {
				let name = obj.firstname + " " + obj.lastname;

				if(regex.test(name)){
					res["t" + obj.teacherId] = name
				}
			})

			this.data.rooms.forEach(obj => {
				if(regex.test(obj.code)){
					res["r" + obj.roomId] = obj.code
				}
			})

			this.data.groups.forEach(obj => {
				if(regex.test(obj.groupCode)){
					res["g" + obj.groupId] = obj.groupCode
				}
			})

			return res
		}else{
			return {}
		}
	}

	this.getSearchData().then(indata => {
		this.data = indata

		this.searchElm.disabled = false
	})

	searchbox.addEventListener("input", e => {
		this.search(e.target.value).then(results => {
			this.resElm.innerText = ""

			for(let item in results){
				let elm = document.createElement("a")
				elm.innerText = results[item]
				switch (item[0]){
					case "t":
						elm.href = "?type=teachers&id=" + item.slice(1)
						break
					case "r":
						elm.href = "?type=rooms&id=" + item.slice(1)
						break
					case "g":
						elm.href = "?type=groups&id=" + item.slice(1)
						break
				}
				elm.id = item

				elm.addEventListener("click", e => {
					console.log(e.target.id, e.target.innerText)
				})

				this.resElm.insertAdjacentElement("beforeend", elm)
			}
		})
	})
}
