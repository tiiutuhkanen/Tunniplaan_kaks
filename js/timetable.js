function Timeteable(elm){
	this.elm = elm

	this.findGetParameter = function (parameterName) {
		var result = null,
			tmp = [];
		location.search
			.substr(1)
			.split("&")
			.forEach(function (item) {
				tmp = item.split("=");
				if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
			});
		return result;
	}

	this.getLessons = async function (){
		let raw = await fetch("https://be.ta19heinsoo.itmajakas.ee/api/lessons/"
				+ this.findGetParameter("type") + "=" + this.findGetParameter("id")
				+ "&weeks=" + this.findGetParameter("week"))
		// let raw = await fetch("lessons.json")
		this.data = await raw.json()

		return this.data
	}

	this.addLesson = function (times, room, lesson, teacher){
		this.elm.insertAdjacentHTML("beforeend", (
			`<div id="res">
				<div style="border: solid 5px black;" >
					<div style="font-weight: bold; display: flex; justify-content: space-between; font-size: 2rem" class="top">
						<span class="times">${times}</span>
						<span class="room">${room}</span>
					</div>

					<div style="font-weight: bold;" class="lesson">${lesson}</div>
					<div class="teacher">${teacher}</div>
				</div>
			</div>`
		))
	}

	this.getLessons().then(() => {
		if(this.data.timetableEvents != undefined){
			this.data.timetableEvents.forEach(item => {
				if(item.nameEt != null){
					time = item.timeStart + "-" + item.timeEnd;
					this.addLesson(
						time,
						item.rooms[0].roomCode,
						item.nameEt,
						item.teachers[0].name,
					)
				}
			})
		}
	})
}
