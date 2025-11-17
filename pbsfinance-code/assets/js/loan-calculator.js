// PBS Finance – Loan Calculator (sliders + editable inputs)

(function ($) {
  "use strict";

  function clamp(val, min, max) {
    val = Number(val);
    if (isNaN(val)) return min;
    return Math.min(Math.max(val, min), max);
  }

  function formatMoney(n) {
    return n.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function recalc() {
    var principal = Number($("#pricipal-input").val()) || 0;
    var months = Number($("#totalyear-input").val()) || 0;
    var rateYear = Number($("#intrest-input").val()) || 0;

    if (principal <= 0 || months <= 0 || rateYear <= 0) {
      return;
    }

    // Update counters on the left
    $("#pricipal").text(Math.round(principal).toLocaleString("en-ZA"));
    $("#totalyear").text(months);
    $("#intrest").text(rateYear);

    var r = rateYear / 12 / 100; // monthly interest rate
    var n = months;

    var emi =
      principal * r * Math.pow(1 + r, n) /
      (Math.pow(1 + r, n) - 1);

    var total = emi * n;
    var interest = total - principal;

    $("#emi").text(formatMoney(emi));
    $("#tbl_emi").text(formatMoney(interest));
    $("#tbl_la").text(formatMoney(total));
    $("#t_m").text(n);
    $("#t_ir").text(rateYear);
  }

  $(function () {
    // ----- Config -----
    var principalMin = 10000,
      principalMax = 5000000,
      principalStep = 1000;

    var monthsMin = 12,
      monthsMax = 360,
      monthsStep = 1;

    var rateMin = 4,
      rateMax = 16,
      rateStep = 0.25;

    // ----- Initialise inputs from default or span text -----
    var principalInit =
      Number($("#pricipal").text().replace(/,/g, "")) || 100000;
    var monthsInit =
      Number($("#totalyear").text().replace(/,/g, "")) || 120;
    var rateInit =
      Number($("#intrest").text().replace(/,/g, "")) || 10;

    principalInit = clamp(principalInit, principalMin, principalMax);
    monthsInit = clamp(monthsInit, monthsMin, monthsMax);
    rateInit = clamp(rateInit, rateMin, rateMax);

    $("#pricipal-input").val(principalInit);
    $("#totalyear-input").val(monthsInit);
    $("#intrest-input").val(rateInit);

    // ----- Sliders -----
    $("#pricipal-slide").slider({
      range: "min",
      min: principalMin,
      max: principalMax,
      step: principalStep,
      value: principalInit,
      slide: function (event, ui) {
        $("#pricipal-input").val(ui.value);
        recalc();
      },
      change: function () {
        recalc();
      }
    });

    $("#totalyear-slide").slider({
      range: "min",
      min: monthsMin,
      max: monthsMax,
      step: monthsStep,
      value: monthsInit,
      slide: function (event, ui) {
        $("#totalyear-input").val(ui.value);
        recalc();
      },
      change: function () {
        recalc();
      }
    });

    $("#intrest-slide").slider({
      range: "min",
      min: rateMin,
      max: rateMax,
      step: rateStep,
      value: rateInit,
      slide: function (event, ui) {
        $("#intrest-input").val(ui.value);
        recalc();
      },
      change: function () {
        recalc();
      }
    });

    // ----- Inputs -> sliders -----
    $("#pricipal-input").on("input change", function () {
      var v = clamp(this.value, principalMin, principalMax);
      this.value = v;
      $("#pricipal-slide").slider("value", v);
      recalc();
    });

    $("#totalyear-input").on("input change", function () {
      var v = clamp(this.value, monthsMin, monthsMax);
      this.value = v;
      $("#totalyear-slide").slider("value", v);
      recalc();
    });

    $("#intrest-input").on("input change", function () {
      var v = clamp(this.value, rateMin, rateMax);
      this.value = v;
      $("#intrest-slide").slider("value", v);
      recalc();
    });

    // Initial calculation
    recalc();
  });
})(jQuery);
