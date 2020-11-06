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
		if(this.findGetParameter("type") && this.findGetParameter("id") && this.findGetParameter("week")){
			let raw = await fetch("https://be.ta19heinsoo.itmajakas.ee/api/lessons/"
					+ this.findGetParameter("type") + "=" + this.findGetParameter("id")
					+ "&weeks=" + this.findGetParameter("week"))
			// let raw = await fetch("lessons.json")
			this.data = await raw.json()

			return this.data
		}else{
			return null
		}
	}

	this.addLesson = function (elm, times, room, lesson, teacher){
		elm.insertAdjacentHTML("beforeend", (
			`
				<div class="lesson">
					<div class="top">
						<span>${times}</span>
						<span>${room}</span>
					</div>

					<div class="lessonName">${lesson}</div>
					<div class="teacher">${teacher}</div>
				</div>
			`
		))
	}

	this.getLessons().then(() => {
		if(this.data != undefined && this.data.timetableEvents != undefined){

			let elm, prevDate
			this.data.timetableEvents.forEach(item => {
				if(item.nameEt != null){
					date = moment(item.date)

					if(date.date() != prevDate){
						elm = document.createElement("div")
						elm.className = "day"

						elm.insertAdjacentHTML("beforeend",
							`
							<div class="dateName">
								<span>${date.format("dddd")}</span>
								<span>${date.format("DD.MM.YY")}</span>
							</div>
							`
						)
					}

					time = item.timeStart + "-" + item.timeEnd;
					this.addLesson(
						elm,
						time,
						item.rooms[0].roomCode,
						item.nameEt,
						item.teachers[0].name,
					)

					prevDate = date.date()

					this.elm.insertAdjacentElement("beforeend", elm)
				}
			})
		}
	})
}
