// screens/CalendarScreen.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";

import styles from "../style/calendar.styles";
import useCalendarLogic from "./scripts/CalendarScript";

export default function CalendarScreen() {
  const c = useCalendarLogic();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../public/image/Primary_Pattern.png")}
        style={styles.topPattern}
        resizeMode="stretch"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          {c.isGuardianView ? (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={c.exitGuardianView}
            >
              <Text style={styles.headerButtonText}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 44 }} />
          )}

          <Text style={styles.headerTitle}>
            {c.isGuardianView ? "피보호자 캘린더" : "캘린더"}
          </Text>

          <View style={styles.headerButtonGroup}>
            {c.user.role === "protector" && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={c.loadMembers}
              >
                <Text style={styles.headerButtonText}>👥</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.headerButton}
              onPress={c.loadSchedules}
            >
              <Text style={styles.headerButtonText}>📋</Text>
            </TouchableOpacity>

            {!c.isGuardianView && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => c.setShowAddModal(true)}
              >
                <Text style={styles.headerButtonText}>＋</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Calendar
          onDayPress={(day) => c.setSelectedDate(day.dateString)}
          markedDates={{ [c.selectedDate]: { selected: true } }}
          style={styles.calendarBox}
        />

        <Text style={styles.dateTitle}>
          {c.selectedDate} 복용 예정 목록
        </Text>

        {c.loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            key={`${c.targetUser}_${c.selectedDate}`}   // 🔥 핵심
            data={c.logs}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                복용 예정 약이 없습니다
              </Text>
            }
            renderItem={({ item }) => (
              <View
                style={[
                  styles.logItem,
                  item.status === 1 && styles.logDone,
                  item.status === 0 && styles.logCanceled,
                ]}
              >
                <TouchableOpacity
                  disabled={c.isGuardianView}
                  onPress={() => !c.isGuardianView && c.confirmToggleLog(item)}
                  >
                  <View style={styles.logRow}>
                    <Text style={styles.logTime}>
                      {item.planned_time}
                    </Text>
                    <Text style={styles.logStatus}>
                      {item.status === 1
                        ? "복용"
                        : item.status === 0
                        ? "취소"
                        : "미복용"}
                    </Text>
                  </View>

                  <Text style={styles.logSubText}>
                    {item.medicine_name || ""}
                    {item.method ? ` · ${item.method}` : ""}
                  </Text>
                </TouchableOpacity>

                {c.isLocked && (
                  <Text style={styles.lockHintText}>
                    보호자에 의해 잠긴 스케줄입니다
                  </Text>
                )}
              </View>
            )}
          />
        )}
      </View>

      <Image
        source={require("../../public/image/pattern.png")}
        style={styles.bottomPattern}
        resizeMode="stretch"
      />

      <Modal visible={c.showAddModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <ScrollView>
              <Text style={styles.modalTitle}>스케줄 추가</Text>

              <TextInput
                style={styles.input}
                placeholder="약 이름"
                value={c.medicineName}
                onChangeText={c.setMedicineName}
              />

              <Text style={styles.label}>시작 날짜</Text>
              <TouchableOpacity onPress={() => c.setShowStartPicker(true)}>
                <Text style={styles.dateBox}>{c.startDate}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>종료 날짜</Text>
              <TouchableOpacity onPress={() => c.setShowEndPicker(true)}>
                <Text style={styles.dateBox}>{c.endDate}</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>복용 주기</Text>
              <View style={styles.radioGroup}>
                {["daily", "weekly"].map((v) => (
                  <TouchableOpacity
                    key={v}
                    style={styles.radioItem}
                    onPress={() => c.setCycle(v)}
                  >
                    <View style={styles.radioOuter}>
                      {c.cycle === v && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>{v === "daily" ? "매일" : "매주"}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {c.cycle === "weekly" && (
                <>
                  <Text style={styles.sectionTitle}>요일 선택</Text>
                  <View style={styles.weekdayRow}>
                    {[
                      { label: "일", v: 0 },
                      { label: "월", v: 1 },
                      { label: "화", v: 2 },
                      { label: "수", v: 3 },
                      { label: "목", v: 4 },
                      { label: "금", v: 5 },
                      { label: "토", v: 6 }
                    ].map((d) => {
                      const active = c.weekdays.includes(d.v);
                      return (
                        <TouchableOpacity
                          key={d.v}
                          style={[styles.weekdayChip, active && styles.weekdayChipActive]}
                          onPress={() => {
                            if (active) c.setWeekdays(c.weekdays.filter((x) => x !== d.v));
                            else c.setWeekdays([...c.weekdays, d.v]);
                          }}
                        >
                          <Text>{d.label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}

              <Text style={styles.sectionTitle}>복용 방법</Text>
              <View style={styles.radioGroup}>
                {[
                  { key: "oral", label: "물과 복용" },
                  { key: "after_meal", label: "식후 복용" },
                  { key: "before_meal", label: "식전 복용" },
                  { key: "injection", label: "주사" },
                  { key: "spray", label: "흡입" },
                  { key: "etc", label: "기타" }
                ].map((m) => (
                  <TouchableOpacity key={m.key} style={styles.radioItem} onPress={() => c.setMethod(m.key)}>
                    <View style={styles.radioOuter}>
                      {c.method === m.key && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>{m.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>하루 복용 횟수</Text>
              <View style={styles.radioGroup}>
                {[1, 2, 3, 4].map((n) => (
                  <TouchableOpacity key={n} style={styles.radioItem} onPress={() => c.updatePerDay(n)}>
                    <View style={styles.radioOuter}>
                      {c.perDay === n && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>{n}회</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>복용 예정 시간</Text>
              {c.times.map((t, i) => (
                <TouchableOpacity key={i} style={styles.timeBox} onPress={() => c.setTimePickerIndex(i)}>
                  <Text style={styles.timeText}>{t}</Text>
                </TouchableOpacity>
              ))}

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={c.closeAllModals}>
                  <Text>취소</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.addBtn} onPress={c.createSchedule}>
                  <Text>추가</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>


      <Modal visible={c.showEditModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <ScrollView>
              <Text style={styles.modalTitle}>스케줄 관리</Text>

              <TextInput
                style={styles.input}
                placeholder="약 이름"
                value={c.medicineName}
                onChangeText={c.setMedicineName}
                editable={!c.isLocked}
              />

              <Text style={styles.label}>시작 날짜</Text>
              <TouchableOpacity disabled={c.isLocked} onPress={() => c.setShowStartPicker(true)}>
                <Text style={[styles.dateBox, c.isLocked && styles.disabledBox]}>{c.startDate}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>종료 날짜</Text>
              <TouchableOpacity disabled={c.isLocked} onPress={() => c.setShowEndPicker(true)}>
                <Text style={[styles.dateBox, c.isLocked && styles.disabledBox]}>{c.endDate}</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>복용 주기</Text>
              <View style={styles.radioGroup}>
                {["daily", "weekly"].map((v) => (
                  <TouchableOpacity
                    key={v}
                    style={styles.radioItem}
                    disabled={c.isLocked}
                    onPress={() => c.setCycle(v)}
                  >
                    <View style={styles.radioOuter}>
                      {c.cycle === v && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>{v === "daily" ? "매일" : "매주"}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {c.cycle === "weekly" && (
                <>
                  <Text style={styles.sectionTitle}>요일 선택</Text>
                  <View style={styles.weekdayRow}>
                    {[
                      { label: "일", v: 0 },
                      { label: "월", v: 1 },
                      { label: "화", v: 2 },
                      { label: "수", v: 3 },
                      { label: "목", v: 4 },
                      { label: "금", v: 5 },
                      { label: "토", v: 6 }
                    ].map((d) => {
                      const active = c.weekdays.includes(d.v);
                      return (
                        <TouchableOpacity
                          key={d.v}
                          disabled={c.isLocked}
                          style={[styles.weekdayChip, active && styles.weekdayChipActive]}
                          onPress={() => {
                            if (active) c.setWeekdays(c.weekdays.filter((x) => x !== d.v));
                            else c.setWeekdays([...c.weekdays, d.v]);
                          }}
                        >
                          <Text>{d.label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}

              <Text style={styles.sectionTitle}>하루 복용 횟수</Text>
              <View style={styles.radioGroup}>
                {[1, 2, 3, 4].map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={styles.radioItem}
                    disabled={c.isLocked}
                    onPress={() => c.updatePerDay(n)}
                  >
                    <View style={styles.radioOuter}>
                      {c.perDay === n && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>{n}회</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>복용 예정 시간</Text>
              {c.times.map((t, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.timeBox, c.isLocked && styles.disabledBox]}
                  disabled={c.isLocked}
                  onPress={() => c.setTimePickerIndex(i)}
                >
                  <Text style={styles.timeText}>{t}</Text>
                </TouchableOpacity>
              ))}

              {c.isLocked && (
                <Text style={styles.lockHintText}>
                  이 스케줄은 보호자에 의해 잠겨 있습니다
                </Text>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={c.closeAllModals}>
                  <Text>닫기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.addBtn, c.isLocked && styles.manageBtnDisabled]}
                  disabled={c.isLocked}
                  onPress={c.saveEditSchedule}
                >
                  <Text>수정 저장</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.deleteBtnBox, c.isLocked && styles.manageBtnDisabled]}
                  disabled={c.isLocked}
                  onPress={c.deleteSchedule}
                >
                  <Text style={styles.deleteBtnText}>삭제</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      <Modal visible={c.showScheduleList} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>전체 스케줄</Text>

            <FlatList
              data={c.scheduleList}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={<Text style={styles.emptyText}>스케줄 없음</Text>}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.logItem}
                  onPress={() => {
                    console.log("RAW ITEM:", item);
                    console.log("ITEM._id:", item._id, typeof item._id);                    
                    c.deleteSchedule(item);  
                  }}
                >
                  <Text style={styles.logTime}>{item.medicine_name}</Text>
                  <Text style={styles.logSubText}>
                    {item.start_date} ~ {item.end_date}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => c.setShowScheduleList(false)}
            >
              <Text>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={c.showMemberModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>피보호자 선택</Text>

            <FlatList
              data={c.members}
              keyExtractor={(item, index) => {
                if (typeof item === "string") return item;
                if (item?.userID) return item.userID;
                return String(index);
              }}
              renderItem={({ item }) => {
                const memberId =
                  typeof item === "string" ? item : item.userID;

                const displayName =
                  typeof item === "string"
                    ? item
                    : item.name || item.userID;

                const isSelf = memberId === c.user.userID;

                return (
                  <TouchableOpacity
                    style={[
                      styles.logItem,
                      isSelf && { opacity: 0.5 }
                    ]}
                    disabled={isSelf}
                    onPress={() => {
                      c.setTargetUser(memberId);
                      c.setShowMemberModal(false);
                    }}
                  >
                    <Text style={styles.logTime}>
                      {displayName}
                    </Text>

                    {isSelf && (
                      <Text style={styles.logSubText}>(본인)</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>그룹원이 없습니다</Text>
              }
            />

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => c.setShowMemberModal(false)}
            >
              <Text>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pickers */}
      {c.showStartPicker && (
        <DateTimePicker
          value={new Date(c.startDate)}
          mode="date"
          display="calendar"
          onChange={(_, d) => {
            c.setShowStartPicker(false);
            if (d) c.setStartDate(d.toISOString().slice(0, 10));
          }}
        />
      )}

      {c.showEndPicker && (
        <DateTimePicker
          value={new Date(c.endDate)}
          mode="date"
          display="calendar"
          onChange={(_, d) => {
            c.setShowEndPicker(false);
            if (d) c.setEndDate(d.toISOString().slice(0, 10));
          }}
        />
      )}

      {c.timePickerIndex !== null && (
        <DateTimePicker
          value={new Date(`1970-01-01T${c.times[c.timePickerIndex]}:00`)}
          mode="time"
          display="spinner"
          is24Hour
          onChange={(_, d) => {
            const idx = c.timePickerIndex;
            c.setTimePickerIndex(null);
            if (!d) return;
            const hh = String(d.getHours()).padStart(2, "0");
            const mm = String(d.getMinutes()).padStart(2, "0");
            c.updateTime(idx, `${hh}:${mm}`);
          }}
        />
      )}
    </View>
  );
}
